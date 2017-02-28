from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from api.serializers import UserSerializer, LinkSerializer
from api.models import Link
from forms import LoginForm
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm, AuthenticationForm

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
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        form = LoginForm(request.POST)
        user = authenticate(username=username, password=password)
        print form.is_valid(), user
        if form.is_valid() and user is not None:
            auth_login(request, user)
            return HttpResponseRedirect('/')
    else:
        form = LoginForm()

    template = loader.get_template('links/login.html')
    context = {'form': LoginForm}
    return HttpResponse(template.render(context,request))

def logout(request):
    auth_logout(request)
    return HttpResponseRedirect('/')

def signup(request):
    # 
    template = loader.get_template('links/signup.html')
    context = {}
    return HttpResponse(template.render(context,request))


@login_required(login_url="/login/")
def change_password(request):
    template = loader.get_template('links/change_password.html')
    context = {}
    return HttpResponse(template.render(context,request))