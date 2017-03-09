import factory
from django.utils import timezone
from django.contrib.auth.models import User
from . import models

class UserFactory(factory.Factory):
    class Meta:
        model = User

    username = factory.Faker('first_name')
    is_staff = False
    is_superuser = False

    @classmethod
    def _prepare(cls, create, **kwargs):
        password = 'password'
        if 'password' in kwargs:
            password = kwargs.pop('password')
        user = super(UserFactory, cls)._prepare(create, **kwargs)
        user.set_password(password)
        if create:
            user.save()
        return user

class LinkFactory(factory.Factory):
    class Meta:
        model = models.Link

    user = factory.Iterator(User.objects.all())
    title = factory.Sequence(lambda n: 'Link Number {0}'.format(n))
    url = 'https:/www.google.com'
    description = ''
    created = factory.LazyFunction(timezone.now)
    modified = factory.LazyFunction(timezone.now)

def build():
    """
    py manage.py shell -c "from api.factories import build;build()"
    """
    from django.db import transaction
    import requests

    r = requests.get('http://mattdsegal.com/links/api/user')
    user_data = r.json() 
  

    r = requests.get('http://mattdsegal.com/links/api/links')
    link_data = r.json()
   
    models.Link.objects.all().delete()
    User.objects.all().delete()

    with transaction.atomic():

        for u_data in user_data:
            user = UserFactory(username=u_data['name'])

            user_links = [
                l for l in link_data
                if l['user'] == u_data['name']
            ]

            print len(user_links)

            for l_data in user_links:
                link = LinkFactory(
                    user=user,
                    title=l_data['title'],
                    url=l_data['url']
                )
                link.save()

            print 'Successfully created user {0}'.format(user.username)