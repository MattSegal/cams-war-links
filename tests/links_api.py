import requests

TEST_URL = 'http://localhost:5000'
HEADERS = {
    "content-type" : "application/json"
}

def create_user(name,base_url=TEST_URL):
    url = base_url+'/api/user/{0}'.format(name)
    print "\tPOST {0}".format(url)
    response = requests.post(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)

def delete_user(name,base_url=TEST_URL):
    url = base_url+'/api/user/{0}'.format(name)
    print "\tDELETE {0}".format(url)
    response = requests.delete(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)