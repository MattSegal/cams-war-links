from django.http import HttpResponse
from django.template import loader
from api.serializers import UserSerializer, LinkSerializer
from api.models import Link

from django.contrib.auth.models import User

import json

def index(request):
    template = loader.get_template('links/index.html')

    users = User.objects.all()
    links = Link.objects.all()

    context = {
        'bootstrap_data': json.dumps({
                'users': {
                    'isFetching': False,
                    'items': UserSerializer(users, many=True).data
                },
                'links': {
                    'isFetching': False,
                    'items': LinkSerializer(links, many=True).data
                }
        })
    }
    return HttpResponse(template.render(context,request))