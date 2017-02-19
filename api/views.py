from serializers import UserSerializer, LinkSerializer
from rest_framework import viewsets, status
from rest_framework.response  import Response 
from django.contrib.auth.models import User
from .models import Link

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LinkViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Link.objects.all()
    serializer_class = LinkSerializer