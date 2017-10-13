from django.conf.urls import include, url
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'link', views.LinkViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
