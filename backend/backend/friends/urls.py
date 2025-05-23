from django.urls import path

from .views import SendFriendRequestView, accept_friend_request

app_name = 'api/friend-requests/'
urlpatterns = [
    path('send/', SendFriendRequestView.as_view(), name='public-user'),
    path('accept/', accept_friend_request, name='public-user'),
]
