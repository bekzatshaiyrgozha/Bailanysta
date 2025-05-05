from django.db import models

from users.models import Users


class Notification(models.Model):
    TYPE_CHOICES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow')
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    to_user = models.ForeignKey(Users, related_name='notifications', on_delete=models.CASCADE)
    from_user = models.ForeignKey(Users, related_name='+', on_delete=models.CASCADE)
    post = models.ForeignKey('post.Post', on_delete=models.CASCADE, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    comment_text = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f"{self.from_user} {self.type} on {self.created}"
