import requests
import json

TEST_URL = 'http://localhost:5000/links'
HEADERS = {
    "content-type" : "application/json"
}

def get_users(base_url=TEST_URL):
    url = base_url+'/api/user'
    print "\tGET all users"
    response = requests.get(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)
    return response.json()

def create_user(name,base_url=TEST_URL):
    url = base_url+'/api/user/{0}'.format(name)
    print "\tPOST {0}".format(url)
    response = requests.post(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)
    return response.status_code

def delete_user(name,base_url=TEST_URL):
    url = base_url+'/api/user/{0}'.format(name)
    print "\tDELETE {0}".format(url)
    response = requests.delete(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)
    return response.status_code

def get_links(base_url=TEST_URL):
    url = base_url+'/api/links'
    print "\tGET all links"
    response = requests.get(url,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)
    return response.json()

def create_link(link,base_url=TEST_URL):
    url = base_url+'/api/link'
    print "\tPOST {0}".format(url)
    link_json = json.dumps(link)
    response = requests.post(url,data=link_json,headers=HEADERS)
    response.raise_for_status()
    print "\tstatus code {0}".format(response.status_code)
    return response.status_code