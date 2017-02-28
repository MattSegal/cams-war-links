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

def build_users(num_users):
    User.objects.all().delete()

    users = UserFactory.build_batch(num_users)

    for user in users:
        user.save()
        print 'Successfully created user {0}'.format(user.username)

    import json
    file_path = 'D:\\code\\web\\links\\api\\fixtures\\new_links.json'
    with open(file_path, 'r') as f:
        links = json.load(f)
        for link in links:
            link = LinkFactory(url=link['url'],title=link['title'])
            link.save()