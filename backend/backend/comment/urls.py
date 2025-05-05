from django.urls import path

from .views import CommentDetail

app_name = 'api/comments'
urlpatterns = [
    path('<int:pk>/', CommentDetail.as_view()),
]
