class UserRepository:
    def __init__(self,con):
        self.con = con
        
    def get_all(self):
        cur = self.con.get_cursor();
        cur.execute("SELECT * FROM users")
        users = cur.fetchall()
        return users

    def check_exists(self,username):
        cur = self.con.get_cursor();
        query = 'SELECT EXISTS(SELECT 1 FROM users WHERE name = %s) AS user_exists'
        cur.execute(query,[username])
        user_exists = bool(cur.fetchone()['user_exists'])
        return user_exists

    def create(self,username):
        cur = self.con.get_cursor();
        add_user = "INSERT INTO users(name) VALUES(%s)"
        cur.execute(add_user,[username])

    def delete(self,username):
        cur = self.con.get_cursor();
        delete_user = "DELETE FROM users WHERE name = %s"
        cur.execute(delete_user,[username])

