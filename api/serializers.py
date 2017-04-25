from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Link

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','bookmarks',)

class LinkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Link
        fields = ('id','user','title','url','created','description',)