import json

from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader

from api.models import Link
from api.serializers import LinkSerializer, UserSerializer
from forms import ChangePasswordForm, LoginForm, SignupForm

NO_ACTIVE_USER = -1   # constant for client-side JS - this sucks


def index(request):
    template = loader.get_template('links/index.html')

    # TODO: Use view data to bootstrap data, as this is duplication
    users = User.objects.filter(is_superuser=False)
    links = (
        Link.objects
        .filter(active=True)
        .order_by('-created')
    )[:40]

    context = {
        'bootstrap_data': {
                'users': {
                    'isFetching': False,
                    'activeUserId': NO_ACTIVE_USER,
                    'items': UserSerializer(users, many=True).data,
                },
                'links': {
                    'isFetching': False,
                    'items': LinkSerializer(links, many=True).data,
                    'next': request.build_absolute_uri('/api/link/?page=2'),  # yucky hack
                    'start': request.build_absolute_uri('/api/link/?page=1'), # yucky hack
                }
        }
    }

    if request.user.is_authenticated:
        context['bootstrap_data'].update({
            'loggedInUser': UserSerializer(request.user).data,
        })

    context['bootstrap_data'] = json.dumps(context['bootstrap_data'])
    return HttpResponse(template.render(context, request))


def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = request.POST.get('username', '').lower()
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return HttpResponseRedirect('/')
            else:
                form.add_error(
                    None,
                    'Invalid username or password',
                )
    else:
        form = LoginForm()

    template = loader.get_template('links/login.html')
    context = {'form': form}
    return HttpResponse(template.render(context, request))


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect('/')


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = request.POST['username'].lower()
            password = request.POST['password']
            user = User.objects.create_user(
                username=username,
                password=password,
            )
            auth_login(request, user)
            return HttpResponseRedirect('/')
    else:
        form = SignupForm()

    template = loader.get_template('links/signup.html')
    context = {'form': form}
    return HttpResponse(template.render(context, request))


@login_required(login_url="/change/")
def change_password(request):
    if request.method == 'POST':
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['password']
            request.user.set_password(new_password)
            request.user.save()  # Django automatically logs you out
            return HttpResponseRedirect('/')
    else:
        form = ChangePasswordForm()

    template = loader.get_template('links/change_password.html')
    context = {'form': form}
    return HttpResponse(template.render(context, request))
