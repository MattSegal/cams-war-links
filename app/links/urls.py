from django.conf.urls import include, url
from django.contrib import admin

from . import views

urlpatterns = [

    # Django
    url(r'^login/$', views.login),
    url(r'^logout/$', views.logout),
    url(r'^signup/$', views.signup),
    url(r'^change/$', views.change_password),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('api.urls')),
    # React Router
    url(r'^$', views.IndexView.as_view()),
    url(r'^bookmarks/$', views.IndexView.as_view()),
    url(r'^menu/$', views.IndexView.as_view()),
    url(r'^link/', views.IndexView.as_view()),
    url(r'^add/$', views.IndexView.as_view()),
    url(r'^account/$', views.IndexView.as_view()),
    url(r'^search/$', views.IndexView.as_view()),
]
