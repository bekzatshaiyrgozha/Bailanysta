from django.urls import path
from .views import UserSearchView

app_name = 'api/search/'
urlpatterns = [
    path('', UserSearchView.as_view(), name='user-search'),
]
