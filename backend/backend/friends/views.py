from django.db.models import Q
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notification.models import Notification
from users.models import Users
from .models import FriendRequest, Friendship
from .serializers import FriendRequestSerializer, FriendSerializer


class SendFriendRequestView(generics.CreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        to_user = get_object_or_404(Users, pk=request.data.get('to_user_id'))
        if request.user == to_user:
            return Response({"error": "You cannot send a friend request to yourself."},
                            status=status.HTTP_400_BAD_REQUEST)
        if FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists():
            return Response({"error": "Friend request already sent."}, status=status.HTTP_409_CONFLICT)
        FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        Notification.objects.create(
            type='follow',
            to_user=to_user,
            from_user=request.user,
            post=None
        )
        return Response(status=status.HTTP_201_CREATED)


class FriendRequestListView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user, is_accepted=False)


@api_view(['POST'])
def accept_friend_request(request):
    user_id = request.data.get('userId')
    friend_request = get_object_or_404(FriendRequest, from_user_id=user_id, to_user=request.user, is_accepted=False)

    if friend_request:
        friend_request.accept()
        return Response({'status': 'Friend request accepted'})
    else:
        return Response({'error': 'No such friend request'}, status=400)


class FriendListView(generics.ListAPIView):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friends_ids = Friendship.objects.filter(
            Q(user=user) | Q(friend=user)
        ).values_list('friend_id', flat=True) | Friendship.objects.filter(
            Q(friend=user)
        ).values_list('user_id', flat=True)
        return Users.objects.filter(id__in=friends_ids).distinct()


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def friend_status(request, username):
    current_user = request.user

    if request.method == 'GET':
        try:
            target_user = Users.objects.get(username=username)
        except Users.DoesNotExist:
            raise Http404

        is_friend = Friendship.objects.filter(
            (Q(user=current_user) & Q(friend=target_user)) |
            (Q(user=target_user) & Q(friend=current_user))
        ).exists()

        friend_request_sent = FriendRequest.objects.filter(
            from_user=current_user, to_user=target_user, is_accepted=False
        ).exists()

        friend_request_received = FriendRequest.objects.filter(
            from_user=target_user, to_user=current_user, is_accepted=False
        ).exists()

        return Response({
            'is_friend': is_friend,
            'friend_request_sent': friend_request_sent,
            'friend_request_received': friend_request_received
        })

    elif request.method == 'POST':
        data = request.data
        username = data.get('username')
        accepted = data.get('accepted')

        try:
            target_user = Users.objects.get(username=username)
            if accepted:
                fr = FriendRequest.objects.get(from_user=target_user, to_user=current_user, is_accepted=False)
                fr.accept()
                return JsonResponse({'status': 'accepted'})
            else:
                FriendRequest.objects.filter(from_user=target_user, to_user=current_user, is_accepted=False).delete()
                return JsonResponse({'status': 'rejected'})
        except Users.DoesNotExist:
            raise Http404
        except FriendRequest.DoesNotExist:
            return JsonResponse({'error': 'Friend request not found'}, status=404)



