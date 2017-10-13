from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.response import Response

from serializers import LinkSerializer, UserSerializer

from .models import Link
from .permissions import IsOwnerOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().filter(is_superuser=False)
    serializer_class = UserSerializer

class LinkViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = Link.objects.all().filter(active=True)
    serializer_class = LinkSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a link
        """
        link = self.get_object()
        link.active = False
        link.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
