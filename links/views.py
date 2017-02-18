from django.http import HttpResponse
from django.template import loader

from HTMLParser import HTMLParser

LINKS_DATA_FILE = 'D:\\code\\web\\links\\assets-build\\json\\data.json'
LINKS_JSON = open(LINKS_DATA_FILE,'r').read()\
    .replace('\n','')\
    .replace('\r','')


def index(request):
    template = loader.get_template('links/index.html')
    context = {'bootstrap_data': LINKS_JSON}
    return HttpResponse(template.render(context,request))