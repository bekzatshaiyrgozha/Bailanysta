from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from comment.models import Comment
from comment.serializers import CommentSerializer
from notification.models import Notification
from post.models import Post


class GenericCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs['pk']
        post = get_object_or_404(Post, pk=post_id)
        comment = serializer.save(user=self.request.user, post=post)

        if self.request.user != post.user:
            Notification.objects.create(
                type='comment',
                to_user=post.user,
                from_user=self.request.user,
                post=post,
                comment_text=comment.body
            )


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
