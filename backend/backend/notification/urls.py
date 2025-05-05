from django.urls import path

from .views import NotificationDeleteView, NotificationListView

app_name = 'api/notifications/'
urlpatterns = [
    path('', NotificationListView.as_view()),
    path('<int:pk>/delete/', NotificationDeleteView.as_view()),
]
