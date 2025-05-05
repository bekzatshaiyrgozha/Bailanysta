from rest_framework import serializers

from notification.models import Notification
from post.serializers import PostSerializer
from users.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', 'type', 'from_user', 'post', 'created', 'is_read', 'comment_text']
