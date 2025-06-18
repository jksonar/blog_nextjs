from django.urls import path, include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryViewSet, TagViewSet, CommentViewSet
from .views_user import RegisterView, LoginView, LogoutView, CurrentUserView

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('users/me/', CurrentUserView.as_view(), name='current_user'),
]