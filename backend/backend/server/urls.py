from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter
from users.views import UserLogIn, UserSignUpAPIView

from django.views.generic import RedirectView  # Бұл импортты қосыңыз
from django.urls import reverse_lazy  # reverse_lazy-ді де импорттау қажет

router = DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-user-login/', UserLogIn.as_view()),
    path('sign-up/', UserSignUpAPIView.as_view(), name='user-sign-up'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),


    path('api/', include(router.urls)),

    path('api/users/', include('users.urls')),
    path('api/posts/', include('post.urls')),
    path('api/comments/', include('comment.urls')),
    path('api/notifications/', include('notification.urls')),
    path('api/search/', include('search.urls')),
    path('api/friend-requests/', include('friends.urls')),
    path('post/', include('post.urls')),


    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
