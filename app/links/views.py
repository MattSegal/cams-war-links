import json

from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.views.generic import TemplateView

from api.models import Link
from api.serializers import (LinkSerializer, LoggedInUserSerializer,
                             UserSerializer)
from .forms import ChangePasswordForm, LoginForm, SignupForm

NO_ACTIVE_USER = -1   # constant for client-side JS - this sucks


class IndexView(TemplateView):
    template_name = 'links/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        users = User.objects.filter(is_superuser=False)
        links = Link.objects.filter(active=True).order_by('-created')[:settings.LINK_PAGE_SIZE]
        bootstrap_data = {
            'users': {
                'isFetching': False,
                'activeUserId': NO_ACTIVE_USER,
                'items': UserSerializer(users, many=True).data,
            },
            'links': {
                'isFetching': False,
                'items': LinkSerializer(links, many=True).data,
                'next': '/api/link/?page=2',  # yucky hack
            }
        }

        if self.request.user.is_authenticated:
            bootstrap_data['loggedInUser'] = LoggedInUserSerializer(self.request.user).data

        context['bootstrap_data'] = json.dumps(bootstrap_data)
        return context


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
