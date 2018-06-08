from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Link


class LoggedInUserSerializer(serializers.ModelSerializer):
    bookmarks = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'bookmarks',)

    def get_bookmarks(self, obj):
        return list(LinkSerializer(obj.bookmarks, many=True).data)


class LinkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created = serializers.DateTimeField(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Link
        fields = (
            'id',
            'user_id',
            'username',
            'title',
            'url',
            'created',
            'description'
        )
