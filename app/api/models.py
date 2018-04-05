from django.contrib.auth.models import User
from django.db import models


# see https://docs.djangoproject.com/en/1.10/ref/contrib/auth/#django.contrib.auth.models.User  # noqa
# for user API

class Tag(models.Model):
    """ A tag belonging to a link
    """
    name = models.CharField(max_length=20)

    def __unicode__(self):
        return self.name


class Link(models.Model):
    """ A hyperlink belonging to a user
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name='links')
    bookmarkers = models.ManyToManyField(User, related_name='bookmarks')
    tags = models.ManyToManyField(Tag, related_name='tags')
    title = models.CharField(max_length=250)
    url = models.CharField(max_length=250)
    description = models.TextField(default='', blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    def __unicode__(self):
        return u'{0} - {1}'.format(self.user, self.title)

    def save(self, *args, **kwargs):
        link_has_scheme = (
            self.url.startswith('http://') or
            self.url.startswith('https://')
        )
        if not link_has_scheme:
            self.url = 'http://' + self.url

        super(Link, self).save(*args, **kwargs)
