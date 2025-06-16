from django.contrib import admin
from .models import BlogPost, Category, Tag, Like, Rating, Comment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_published', 'publish_date', 'created_at')
    list_filter = ('is_published', 'category', 'tags', 'author')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    filter_horizontal = ('tags',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content', 'featured_image')
        }),
        ('Categorization', {
            'fields': ('category', 'tags')
        }),
        ('Publication', {
            'fields': ('author', 'is_published', 'publish_date')
        }),
    )

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'value', 'created_at')
    list_filter = ('value', 'created_at')
    search_fields = ('user__username', 'post__title')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'parent', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title', 'content')
    readonly_fields = ('created_at', 'updated_at')
