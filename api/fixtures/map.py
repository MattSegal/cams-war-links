import json

with open('./links.json','r') as f:
    data = json.load(f)
    get = lambda link: {
        'url': link['fields']['url'],
        'title': link['fields']['title'],
    }

    new_data = [get(link) for link in data]

with open('new_links.json', 'w') as f:
    json.dump(new_data,f)
