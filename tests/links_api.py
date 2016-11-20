import requests

TEST_URI = 'http://localhost:5000'
HEADERS = {
    "content-type" : "application/json"
}

def create_user(name):
    uri = TEST_URI+'/api/user/{0}'.format(name)
    response = requests.post(uri,headers=HEADERS)
    response.raise_for_status()

def delete_user(name):
    uri = TEST_URI+'/api/user/{0}'.format(name)
    response = requests.delete(uri,headers=HEADERS)
    response.raise_for_status()