from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from users.models import Users
from users.serializers import UserSerializer


class UserSearchView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q')
        if query:
            return Users.objects.filter(
                Q(username__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query))
        return Users.objects.none()
