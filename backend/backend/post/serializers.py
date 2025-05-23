from rest_framework import serializers

from comment.serializers import CommentSerializer
from post.models import Post


class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    userLiked = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='username'
    )
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'body', 'user', 'created', 'image', 'likes', 'userLiked', 'comments']
