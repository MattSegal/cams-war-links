"""
currently requires you to run the app in a different process
"""

import links_api
import pymysql

connection_params = {
    'host'  : 'localhost',
    'user'  : 'root',
    'passwd':'',
    'db'    :'links'
}

conn = pymysql.connect(**connection_params)

test_user   = "Test"
test_url    = "http://example.com/"
test_title  = "Test Title"

def setup_module():
    setup_query = """
    INSERT INTO users (name)
    VALUES ('{name}');

    INSERT INTO links (user,title,url)
    VALUES ('{name}','{title}','{url}');
    """.format(name=test_user,title=test_title,url=test_url)
    with conn.cursor() as cur:
        cur.execute(setup_query)
    conn.commit()

def teardown_module():
    teardown_query = """
    DELETE FROM users
    WHERE name like '{name}%';

    DELETE FROM links
    WHERE user like '{name}%';
    """.format(name=test_user)
    with conn.cursor() as cur:
        cur.execute(teardown_query)
    conn.commit()
    conn.close()

def test_get_users():
    users = links_api.get_users()
    user = [user for user in users if user['name'] == test_user][0]
    assert type(user['id']) == int
    assert user['name'] == test_user

def test_create_user():
    user_name = test_user + 'Create'
    status_code = links_api.create_user(user_name)
    assert status_code == 200 or status_code == 201
    user_exists = check_user_exists(user_name)
    assert user_exists

def test_delete_user():
    user_name = test_user + 'Delete'
    with conn.cursor() as cur:
        cur.execute("INSERT INTO users (name) VALUES ('{name}')".format(name=user_name))
    conn.commit()
    status_code = links_api.delete_user(user_name)    
    assert status_code == 200
    user_exists = check_user_exists(user_name)
    assert not user_exists

def check_user_exists(user_name):
    query = "SELECT count(*) FROM users WHERE name='{name}'".format(name=user_name)
    with conn.cursor() as cur:
        cur.execute(query)
        user_count = cur.fetchone()[0] 
    return user_count == 1 

def test_get_links():
    links = links_api.get_links()
    link = [link for link in links if link['user'] == test_user][0]
    assert type(link['id']) == int
    assert link['title']    == test_title
    assert link['url']      == test_url
    assert link['user']     == test_user

def _test_create_link():
    link_title = test_title+' Create'
    new_link = {
        'user' : test_user,
        'title' : link_title,
        'url' : test_url,
    }
    status_code = links_api.create_link(new_link)
    assert status_code == 200 or status_code == 201
    link_exists = check_link_exists(test_user,link_title)
    assert link_exists

def test_delete_link():
    pass

def test_update_link():
    pass

def check_link_exists(user,title):
    """
    this doesn't work when it should - won't read new data from db
    still trying to figure out why
    """
    query = "SELECT * FROM links ORDER BY id DESC LIMIT 5"
    with conn.cursor() as cur:
        cur.execute(query)
        import pprint
        pprint.pprint(cur.fetchall())

    query = "SELECT count(*) FROM links WHERE title='{title}' AND user='{name}'".format(name=user,title=title)
    with conn.cursor() as cur:
        cur.execute(query)
        link_count = cur.fetchone()[0]
    print link_count
    return link_count == 1 