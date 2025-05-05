from rest_framework import generics, status
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from gemini.generator import generate_post
from notification.models import Notification
from .models import Post
from friends.models import Friendship
from .permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer
from django.db.models import Q



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000

class GenericPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        current_user = self.request.user
        friends = Friendship.objects.filter(
            Q(user=current_user) | Q(friend=current_user)
        ).distinct()
        friend_ids = set()
        for friendship in friends:
            if friendship.user == current_user:
                friend_ids.add(friendship.friend.id)
            else:
                friend_ids.add(friendship.user.id)

        return Post.objects.filter(user__id__in=friend_ids).order_by('-created')
    
class GenericPostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    


class GenericPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]


class PostByUserId(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Post.objects.filter(user_id=user_id)


class PostByUsername(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return Post.objects.filter(user__username=username)


@api_view(['POST'])
def like_post(request, pk):
    post = generics.get_object_or_404(Post, pk=pk)
    user = request.user

    if post.userLiked.filter(id=user.id).exists():
        post.userLiked.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        post.userLiked.add(user)
        Notification.objects.create(
            type='like',
            to_user=post.user,
            from_user=request.user,
            post=post
        )
        return Response(status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def generate_ai_post(request):
    prompt = request.data.get('prompt')
    if not prompt:
        return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = generate_post(prompt)
        return Response({'generated_text': result}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

