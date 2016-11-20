import connection as con

def setup_links():
    cur = con.get_cursor()
    cur.execute("DROP TABLE IF EXISTS links")
    create_links = """
    CREATE TABLE links (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(500),
        title VARCHAR(500),
        user VARCHAR(20),
        about VARCHAR(500),
        views INT(11)
    )
    """
    cur.execute(create_links)
    cur.execute("DESCRIBE links")
    output = cur.fetchall()
    print output

def seed_links():
    """ inserts dummy links into links table
    """
    cur = con.get_cursor()
    links = (
        (1, 'reddit',           'http://reddit.com',    'Matt'),
        (2, 'github',           'http://github.com',    'Matt'),
        (3, 'youtube',          'http://youtube.com',   'Matt'),
        (4, 'google',           'http://google.com',    'Matt'),
        (5, 'facebook',         'http://facebook.com',  'Matt'),
        (6, '9gag',             'http://9gag.com',      'Cam'),
        (7, 'trollol',          'http://9gag.com',      'Cam'),
        (8, 'kekek',            'http://9gag.com',      'Cam'),
        (9, 'FROSTSHOCK',       'http://9gag.com',      'James'),
        (10, 'CS-GO',           'http://9gag.com',      'James'),
        (11, 'I love horses',   'http://9gag.com',      'James'),
    )
    for link_data in links:
        add_link = "INSERT INTO links(id,title,url,user) VALUES(%s,%s,%s,%s)"
        cur.execute(add_link,link_data)

def setup_users():
    cur = con.get_cursor();
    cur.execute("DROP TABLE IF EXISTS users")
    create_users = """
    CREATE TABLE users 
    (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20)
    )
    """
    cur.execute(create_users)
    cur.execute("DESCRIBE users")
    output = cur.fetchall()
    print output

def seed_users():
    """ Inserts dummy users into users table
    """
    cur = con.get_cursor();
    users = (
        (1, 'Matt'),
        (2, 'Cam'),
        (3, 'James'),
        (4, 'Courtney'),
        (5, 'Simon'),
    )
    for user in users:
        print user
        add_user = "INSERT INTO users(id,name) VALUES(%s,%s)"
        cur.execute(add_user,user)