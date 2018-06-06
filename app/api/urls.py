from django.conf.urls import include, url
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'link', views.LinkViewSet)

urlpatterns = [
    url(r'^bookmark/(?P<link_pk>[0-9]+)/$', views.BookmarkAPIView.as_view()),
    url(r'^search/$', views.SearchView.as_view()),
    url(r'^', include(router.urls)),
]
