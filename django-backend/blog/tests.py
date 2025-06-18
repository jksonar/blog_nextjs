from django.test import TestCase

from django.test import TestCase
from django.utils import timezone
from django.template.defaultfilters import slugify
from .models import BlogPost, Category, Tag, CustomUser, Like, Rating, Comment

class BlogPostModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.tag1 = Tag.objects.create(name='Test Tag 1', slug='test-tag-1')
        self.tag2 = Tag.objects.create(name='Test Tag 2', slug='test-tag-2')

    def test_blogpost_creation(self):
        post = BlogPost.objects.create(
            title='My Test Post',
            content='This is some test content.',
            author=self.user,
            category=self.category,
            is_published=True,
            publish_date=timezone.now()
        )
        post.tags.add(self.tag1, self.tag2)
        post.save()

        self.assertEqual(post.title, 'My Test Post')
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.category, self.category)
        self.assertTrue(post.is_published)
        self.assertIsNotNone(post.publish_date)
        self.assertIn(self.tag1, post.tags.all())
        self.assertIn(self.tag2, post.tags.all())
        self.assertEqual(post.slug, slugify(post.title))

    def test_blogpost_default_values(self):
        post = BlogPost.objects.create(
            title='Another Test Post',
            content='More test content.',
            author=self.user,
            category=self.category
        )
        self.assertFalse(post.is_published)
        self.assertIsNone(post.publish_date)

    def test_blogpost_slug_generation(self):
        post = BlogPost.objects.create(
            title='A Post with a Special Title!@#$',
            content='Content.',
            author=self.user,
            category=self.category
        )
        self.assertEqual(post.slug, slugify(post.title))

    def test_blogpost_str_representation(self):
        post = BlogPost.objects.create(
            title='My String Test Post',
            content='Content.',
            author=self.user,
            category=self.category
        )
        self.assertEqual(str(post), 'My String Test Post')

    def test_published_posts_manager(self):
        # Create a published post
        BlogPost.objects.create(
            title='Published Post',
            content='Content.',
            author=self.user,
            category=self.category,
            is_published=True,
            publish_date=timezone.now()
        )
        # Create an unpublished post
        BlogPost.objects.create(
            title='Unpublished Post',
            content='Content.',
            author=self.user,
            category=self.category,
            is_published=False,
            publish_date=None
        )
        # Create a future published post
        BlogPost.objects.create(
            title='Future Post',
            content='Content.',
            author=self.user,
            category=self.category,
            is_published=True,
            publish_date=timezone.now() + timezone.timedelta(days=1)
        )

        published_posts = BlogPost.published.all()
        self.assertEqual(published_posts.count(), 1)
        self.assertEqual(published_posts.first().title, 'Published Post')

class CategoryModelTest(TestCase):

    def test_category_creation(self):
        category = Category.objects.create(name='Tech', slug='tech')
        self.assertEqual(category.name, 'Tech')
        self.assertEqual(category.slug, 'tech')

    def test_category_str_representation(self):
        category = Category.objects.create(name='Sports', slug='sports')
        self.assertEqual(str(category), 'Sports')

class TagModelTest(TestCase):

    def test_tag_creation(self):
        tag = Tag.objects.create(name='Python', slug='python')
        self.assertEqual(tag.name, 'Python')
        self.assertEqual(tag.slug, 'python')

    def test_tag_str_representation(self):
        tag = Tag.objects.create(name='Django', slug='django')
        self.assertEqual(str(tag), 'Django')

class LikeModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.post = BlogPost.objects.create(
            title='Test Post for Like',
            content='Content.',
            author=self.user,
            category=self.category
        )

    def test_like_creation(self):
        like = Like.objects.create(user=self.user, post=self.post)
        self.assertEqual(like.user, self.user)
        self.assertEqual(like.post, self.post)

    def test_like_unique_together(self):
        Like.objects.create(user=self.user, post=self.post)
        with self.assertRaises(Exception): # IntegrityError
            Like.objects.create(user=self.user, post=self.post)

class RatingModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.post = BlogPost.objects.create(
            title='Test Post for Rating',
            content='Content.',
            author=self.user,
            category=self.category
        )

    def test_rating_creation(self):
        rating = Rating.objects.create(user=self.user, post=self.post, value=5)
        self.assertEqual(rating.user, self.user)
        self.assertEqual(rating.post, self.post)
        self.assertEqual(rating.value, 5)

    def test_rating_update(self):
        rating = Rating.objects.create(user=self.user, post=self.post, value=3)
        rating.value = 4
        rating.save()
        updated_rating = Rating.objects.get(pk=rating.pk)
        self.assertEqual(updated_rating.value, 4)

    def test_rating_value_validation(self):
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            rating = Rating(user=self.user, post=self.post, value=0)
            rating.full_clean()
        with self.assertRaises(ValidationError):
            rating = Rating(user=self.user, post=self.post, value=6)
            rating.full_clean()

class CommentModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.post = BlogPost.objects.create(
            title='Test Post for Comment',
            content='Content.',
            author=self.user,
            category=self.category
        )

    def test_comment_creation(self):
        comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='This is a test comment.'
        )
        self.assertEqual(comment.post, self.post)
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.content, 'This is a test comment.')

    def test_comment_reply(self):
        parent_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Parent comment.'
        )
        reply_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Reply comment.',
            parent=parent_comment
        )
        self.assertEqual(reply_comment.parent, parent_comment)
        self.assertIn(reply_comment, parent_comment.replies.all())

    def test_comment_str_representation(self):
        comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Short comment.'
        )
        self.assertEqual(str(comment), "testuser's comment on Test Post for Comment")
