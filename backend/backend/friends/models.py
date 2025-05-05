from django.db import models

from users.models import Users


class FriendRequest(models.Model):
    from_user = models.ForeignKey(Users, related_name="friend_requests_sent", on_delete=models.CASCADE)
    to_user = models.ForeignKey(Users, related_name="friend_requests_received", on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.from_user.username} to {self.to_user.username}"

    def accept(self):
        Friendship.objects.create(user=self.from_user, friend=self.to_user)
        Friendship.objects.create(user=self.to_user, friend=self.from_user)
        self.is_accepted = True
        self.save()


class Friendship(models.Model):
    user = models.ForeignKey(Users, related_name="friends", on_delete=models.CASCADE)
    friend = models.ForeignKey(Users, related_name="friends_of", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"
