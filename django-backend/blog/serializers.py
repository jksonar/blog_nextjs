from rest_framework import serializers
from django.db.models import Avg
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from .models import BlogPost, Category, Tag, Like, Rating, Comment, CustomUser

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, data):
        # Validate password strength
        try:
            validate_password(data['password'], user=User(**data))
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class BlogPostListSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author', 'category', 'tags', 
            'likes_count', 'average_rating', 'comments_count', 
            'is_published', 'publish_date', 'created_at', 'updated_at'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if not ratings:
            return None
        return obj.ratings.aggregate(Avg('value'))['value__avg']

    def get_comments_count(self, obj):
        return obj.comments.count()

class LikeSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'created_at']


class RatingSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Rating
        fields = ['id', 'user', 'post', 'value', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'parent', 'created_at', 'updated_at', 'replies']
        read_only_fields = ['user', 'post', 'created_at', 'updated_at'] # Added 'post' here

    def get_replies(self, obj):
        # A comment is a parent if its 'parent' field is None
        if obj.parent is None:
            # Access child comments using the related_name 'replies'
            replies = obj.replies.all()
            return CommentSerializer(replies, many=True, context=self.context).data
        return None


class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    category_slug = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field='slug', write_only=True, required=False, allow_null=True
    )
    tags_slugs = serializers.SlugRelatedField(
        queryset=Tag.objects.all(), slug_field='slug', write_only=True, many=True, required=False
    )

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'author', 'category', 'tags',
            'likes_count', 'user_has_liked', 'average_rating', 'user_rating',
            'comments', 'is_published', 'publish_date', 'created_at', 'updated_at',
            'category_slug', 'tags_slugs', 'featured_image'
        ]
        read_only_fields = ['slug', 'likes_count', 'user_has_liked', 'average_rating', 'user_rating', 'comments']

    def create(self, validated_data):
        category_slug = validated_data.pop('category_slug', None)
        tags_slugs = validated_data.pop('tags_slugs', [])

        blog_post = BlogPost.objects.create(**validated_data)

        if category_slug:
            blog_post.category = category_slug
            blog_post.save()

        if tags_slugs:
            blog_post.tags.set(tags_slugs)

        return blog_post

    def update(self, instance, validated_data):
        category_slug = validated_data.pop('category_slug', None)
        tags_slugs = validated_data.pop('tags_slugs', None)

        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.featured_image = validated_data.get('featured_image', instance.featured_image)

        if category_slug is not None:
            instance.category = category_slug
        
        if tags_slugs is not None:
            instance.tags.set(tags_slugs)

        instance.save()
        return instance

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if not ratings:
            return None
        return obj.ratings.aggregate(Avg('value'))['value__avg']

    def get_user_rating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rating = obj.ratings.get(user=request.user)
                return rating.value
            except Rating.DoesNotExist:
                pass