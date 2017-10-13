import json


def get(link):
    return {
        'url': link['fields']['url'],
        'title': link['fields']['title'],
    }


with open('./links.json', 'r') as f:
    data = json.load(f)
    new_data = [get(link) for link in data]

with open('new_links.json', 'w') as f:
    json.dump(new_data, f)
