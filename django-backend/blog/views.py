from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Avg
from .models import BlogPost, Category, Tag, Like, Rating, Comment
from rest_framework import viewsets, filters, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Avg
from .models import BlogPost, Category, Tag, Like, Rating, Comment
from .serializers import (
    BlogPostListSerializer, 
    BlogPostDetailSerializer,
    CategorySerializer,
    TagSerializer,
    LikeSerializer,
    RatingSerializer,
    CommentSerializer
)
from .permissions import IsAuthorOrReadOnly

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'publish_date']
    lookup_field = 'slug'



    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        # Ensure the author is not changed during update
        instance = self.get_object()
        if instance.author != self.request.user:
            self.permission_denied(self.request, message='You do not have permission to edit this post.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            self.permission_denied(self.request, message='You do not have permission to delete this post.')
        instance.delete()

    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'create' or self.action == 'update':
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

        # Filter by author
        author_username = self.request.query_params.get('author', None)
        if author_username:
            queryset = queryset.filter(author__username=author_username)
            
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
        
    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def comments(self, request, slug=None):
        post = self.get_object()
        
        if request.method == 'GET':
            # Get only top-level comments for this post
            comments = post.comments.filter(parent=None)
            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Create a new comment
            serializer = CommentSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user, post=post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # For retrieve, update, and destroy actions, we don't want to filter by post_id or parent_id
        # as the comment is identified by its primary key (id).
        if self.action in ['retrieve', 'update', 'destroy']:
            return queryset

        # Filter by post if post_id is provided
        post_id = self.request.query_params.get('post_id', None)
        if post_id:
            queryset = queryset.filter(post_id=post_id)
            
        # Only return top-level comments (no parent) unless specified
        parent_id = self.request.query_params.get('parent_id', None)
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        else:
            queryset = queryset.filter(parent=None)
            
        return queryset
    
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            self.permission_denied(
                request, message='You do not have permission to edit this comment.'
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            self.permission_denied(
                request, message='You do not have permission to delete this comment.'
            )
        return super().destroy(request, *args, **kwargs)
