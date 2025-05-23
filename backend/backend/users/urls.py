from django.urls import path

from friends.views import friend_status
from post.views import PostByUserId
from post.views import PostByUsername
from .views import GenericUserView, GenericUserDetail

app_name = 'api/users/'
urlpatterns = [
    path('<int:pk>/', GenericUserView.as_view(), name='generic-user'),
    path('<str:username>/', GenericUserDetail.as_view(), name='public-user'),
    path('<str:username>/posts/', PostByUsername.as_view(), name='public-user-posts'),
    path('<int:pk>/posts/', PostByUserId.as_view(), name='current-user-posts'),
    path('<str:username>/friendship-status/', friend_status, name='friendship-status'),
]
