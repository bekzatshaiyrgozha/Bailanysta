from django.urls import path
from post.views import generate_ai_post


from comment.views import GenericCommentListCreateView
from .views import GenericPostCreateView, GenericPostListView, like_post, GenericPostDetailView, generate_ai_post

app_name = 'api/posts/'
urlpatterns = [
    path('', GenericPostListView.as_view(), name='post-list'),
    path('add/', GenericPostCreateView.as_view(), name='post-create'),
    path('<int:pk>', GenericPostDetailView.as_view(), name='post-retrieve-update-delete'),
    path('<int:pk>/like/', like_post, name='like-post'),
    path('<int:pk>/comments/', GenericCommentListCreateView.as_view(), name='comment-list-create'),
    path('generate_ai_post/', generate_ai_post, name='generate_ai_post'),
   
]



