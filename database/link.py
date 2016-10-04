class LinkRepository:
    def __init__(self,con):
        self.con = con

    def validate_create(self,link):
        required_fields = ["title","url","user"]
        return self._validate_link(required_fields,link)

    def validate_update(self,link):
        required_fields = ["title","url","id"]
        return self._validate_link(required_fields,link)

    def _validate_link(self,required_fields,link):
        all_true = lambda x,y : x and y
        validate_field = lambda x : len(str(x)) > 0
        value_validations = [validate_field(link[field]) for field in required_fields]
        is_correct_values = reduce(all_true,value_validations)
        is_correct_fields = set(required_fields).issubset(link.keys())
        return is_correct_fields and is_correct_values

    def get_all(self):
        cur = self.con.get_cursor();
        cur.execute("SELECT * FROM links")
        links = cur.fetchall()
        return links

    def check_exists(self,link_id):
        cur = self.con.get_cursor()
        query = 'SELECT EXISTS (SELECT 1 FROM links WHERE id = %s) AS link_exists'
        cur.execute(query,[link_id])
        link_exists = cur.fetchone()['link_exists']
        return link_exists

    def create(self,link):
        cur = self.con.get_cursor()
        query = """
        INSERT INTO links(title,url,user) 
        VALUES(%(title)s,%(url)s,%(user)s);
        SELECT LAST_INSERT_ID() AS link_id;
        """
        for result in cur.execute(query,link,multi=True):
            if result.description:
                link_id = result.fetchone()['link_id']
        return link_id

    def delete(self,link_id):
        cur = self.con.get_cursor()
        query = "DELETE FROM links WHERE id = %s"
        cur.execute(query,[link_id])

    def update(self,link):
        cur = self.con.get_cursor()
        query = """
        UPDATE links 
        SET title = %(title)s, 
        url = %(url)s 
        WHERE id = %(id)s
        """
        cur.execute(query,link)
