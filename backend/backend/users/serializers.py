from django.db.models import Q
from rest_framework import serializers

from friends.models import Friendship
from .models import Users


class UserSerializer(serializers.ModelSerializer):
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Users
        fields = (
        'id', 'username', 'first_name', 'last_name', 'bio', 'profile_pic', 'email', 'posts', 'comments', 'friends')
        read_only_fields = ('username',)

    def get_friends(self, obj):
        friends = Friendship.objects.filter(Q(user=obj) | Q(friend=obj)).distinct()

        friends_ids = set([f.friend.id if f.user == obj else f.user.id for f in friends])
        friends_ids.discard(obj.id)

        friend_users = Users.objects.filter(id__in=friends_ids)
        return SimpleUserSerializer(friend_users, many=True).data


class UserSignUpSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Users
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = Users(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        user.set_password(password)
        user.save()
        return user


class SimpleUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = ['id', 'username', 'profile_pic']
