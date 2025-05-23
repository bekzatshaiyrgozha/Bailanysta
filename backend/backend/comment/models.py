from django.db import models


class Comment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    body = models.TextField(blank=False)
    user = models.ForeignKey('users.Users', related_name='comments', on_delete=models.CASCADE)
    post = models.ForeignKey('post.Post', related_name='comments', on_delete=models.CASCADE)

    class Meta:
        ordering = ['-created']
