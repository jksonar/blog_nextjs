from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Avg
from .models import BlogPost, Category, Tag, Like, Rating
from .serializers import (
    BlogPostListSerializer, 
    BlogPostDetailSerializer,
    CategorySerializer,
    TagSerializer,
    LikeSerializer,
    RatingSerializer
)

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True, publish_date__lte=timezone.now())
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'publish_date']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        elif self.action == 'like' or self.action == 'unlike':
            return LikeSerializer
        elif self.action == 'rate':
            return RatingSerializer
        return BlogPostListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by tag
        tag_slug = self.request.query_params.get('tag', None)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
            
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, slug=None):
        post = self.get_object()
        user = request.user
        
        # Check if the user already liked the post
        like, created = Like.objects.get_or_create(user=user, post=post)
        
        if created:
            return Response({'status': 'post liked'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'post already liked'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, slug=None):
        post = self.get_object()
        user = request.user
        
        try:
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return Response({'status': 'post unliked'}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response({'status': 'post not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, slug=None):
        post = self.get_object()
        user = request.user
        value = request.data.get('value')
        
        if not value or not isinstance(value, int) or value < 1 or value > 5:
            return Response({'error': 'Invalid rating value. Must be an integer between 1 and 5.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Update or create the rating
        rating, created = Rating.objects.update_or_create(
            user=user, post=post,
            defaults={'value': value}
        )
        
        # Calculate the new average rating
        avg_rating = post.ratings.aggregate(Avg('value'))['value__avg']
        
        return Response({
            'status': 'rating created' if created else 'rating updated',
            'rating': value,
            'average_rating': avg_rating
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
