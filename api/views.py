from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import status, viewsets, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView


from serializers import LinkSerializer, UserSerializer, LoggedInUserSerializer

from .models import Link
from .permissions import IsOwnerOrReadOnly


class BookmarkAPIView(APIView):
    """
    Create or remove a bookmark
    """
    permission_classes = (IsAuthenticated,)
    def post(self, request, link_pk):
        try:
            link = Link.objects.get(pk=link_pk)
        except Link.DoesNotExist:
            raise exceptions.NotFound

        link.bookmarkers.add(request.user)
        serializer = LoggedInUserSerializer(request.user)
        return Response(serializer.data)

    def delete(self, request, link_pk):
        try:
            link = Link.objects.get(pk=link_pk)
        except Link.DoesNotExist:
            raise exceptions.NotFound

        link.bookmarkers.remove(request.user)
        serializer = LoggedInUserSerializer(request.user)
        return Response(serializer.data)


class LinksPagination(PageNumberPagination):
    page_size_query_param = 'size'
    page_size = settings.LINK_PAGE_SIZE
    max_page_size = settings.LINK_PAGE_SIZE

    def get_next_link(self):
        # This is nasty but DRF isn't making it easy to
        # use HTTPS so I just hacked it in rather than override wsgi.url_scheme
        next_link = super(LinksPagination, self).get_next_link()
        if not next_link:
            return None
        if settings.USE_HTTPS:
            next_link = next_link.replace('http://', 'https://')
        return next_link


class LinkViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = Link.objects.filter(active=True).order_by('-created')
    serializer_class = LinkSerializer
    pagination_class = LinksPagination

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a link
        """
        link = self.get_object()
        link.active = False
        link.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
