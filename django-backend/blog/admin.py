from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import BlogPost, Category, Tag, Comment, Like, Rating, CustomUser

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_published', 'publish_date', 'created_at', 'updated_at')
    list_filter = ('is_published', 'category', 'tags', 'publish_date')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    date_hierarchy = 'publish_date'
    ordering = ('-publish_date',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'body')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    list_filter = ('created_at',)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'value', 'created_at')
    list_filter = ('value', 'created_at')

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('date_joined',)
    fieldsets = UserAdmin.fieldsets + (('Avatar', {'fields': ('avatar',)}),)
