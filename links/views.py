from django.http import HttpResponse
from django.template import loader
from api.serializers import UserSerializer, LinkSerializer
from api.models import Link
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from forms import LoginForm

import json

def index(request):
    template = loader.get_template('links/index.html')

    users = User.objects.all()
    links = Link.objects.all()

    # constant for JS - this sucks
    NO_ACTIVE_USER = -1

    context = {
        'bootstrap_data': json.dumps({
                'users': {
                    'isFetching': False,
                    'activeUserId': NO_ACTIVE_USER,
                    'items': UserSerializer(users, many=True).data
                },
                'links': {
                    'isFetching': False,
                    'items': LinkSerializer(links, many=True).data
                }
        })
    }
    return HttpResponse(template.render(context,request))

def login(request):
    template = loader.get_template('links/login.html')
    context = {'form': LoginForm}
    return HttpResponse(template.render(context,request))

def signup(request):
    template = loader.get_template('links/signup.html')
    context = {}
    return HttpResponse(template.render(context,request))

@login_required(login_url="/login/")
def change_password(request):
    template = loader.get_template('links/change_password.html')
    context = {}
    return HttpResponse(template.render(context,request))