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

def build():
    """
    py manage.py shell -c "from api.factories import build;build()"
    """
    from django.db import transaction
    import requests
    from freezegun import freeze_time

    r = requests.get('http://mattslinks.xyz/api/user')
    user_data = r.json() 

    r = requests.get('http://mattslinks.xyz/api/link')
    link_data = r.json()
   
    models.Link.objects.all().delete()
    User.objects.all().delete()

    with transaction.atomic():
        UserFactory(username='admin',is_staff=True,is_superuser=True)
        users = [
            UserFactory(id=u_data['id'], username=u_data['username'].lower())
            for u_data in user_data
        ]
        print 'Successfully created users: {}'.format(users)
        for link in link_data:
            link_users = [u for u in users if u.id == link['user']]
            if len(link_users) == 1:
                with freeze_time(link['created']):
                    link_obj = LinkFactory(
                        user=link_users[0],
                        title=link['title'],
                        url=link['url'],
                        description=link['description']
                    )
                    link_obj.save()

                

