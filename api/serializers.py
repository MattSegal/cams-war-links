from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Link, Tag


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'bookmarks',)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name',)


class LinkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created = serializers.DateTimeField(read_only=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Link
        fields = (
            'id', 'user', 'title', 'url',
            'created', 'description', 'tags',
        )

    def get_tags(self, obj):
        return [tag for tag in TagSerializer(obj.tags).data]
