from django.conf.urls import url, include
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
    url(r'^$',views.index),
    url(r'^bookmarks/$',views.index),
    url(r'^menu/$',views.index),
    url(r'^link/',views.index),
    url(r'^add/$',views.index),

]
