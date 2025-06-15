To expand your blog platform to allow user-generated content (UGC) and user authentication, here’s how to update your PRD with full features, tasks, and best practices:

---

## 📝 Updated PRD: User-Generated Blog Platform

---

### 🔄 What’s New?

* Users can register, log in/out, reset passwords.
* Authenticated users can create, update, delete their own blog posts.
* All users can comment on any blog post.
* Each user has a profile page.

---

## ✅ Updated Requirements

### 1. 🧑‍💻 User Module

#### Features:

* User Registration
* Login / Logout
* Password Reset (email or token-based)
* Profile view/edit
* User Avatar (optional)
* JWT or Session Auth

---

### 2. ✍️ Blog Ownership (UGC)

#### Permissions:

* Users can **add/update/delete only their own blog posts**
* Blog model has `author = ForeignKey(User)`
* Blogs are only **editable by the author**
* Admins can manage all blogs via Django Admin

---

### 3. 💬 Comment System

#### Features:

* Comment model: blog, user, text, timestamps
* Anyone logged in can comment on any blog
* Optional: threaded comments / moderation

---

## 📦 Backend (Django + DRF)

### 🔧 New Models

#### 1. `User` (extend with `AbstractUser` or `OneToOne` profile)

```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
```

#### 2. `BlogPost` (add `author` relation)

```python
author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

#### 3. `Comment`

```python
class Comment(models.Model):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
```

---

## 🔐 Auth & Permissions (DRF)

* Use `IsAuthenticated` or custom permissions like:

```python
class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user
```

---

## 🔧 API Endpoints (New)

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| POST   | `/api/auth/register/`       | Register user              |
| POST   | `/api/auth/login/`          | Login                      |
| POST   | `/api/auth/logout/`         | Logout                     |
| POST   | `/api/auth/reset/`          | Request password reset     |
| GET    | `/api/users/me/`            | Authenticated user profile |
| PATCH  | `/api/users/me/`            | Update profile             |
| POST   | `/api/blogs/`               | Create blog                |
| PUT    | `/api/blogs/<id>/`          | Update blog (owner only)   |
| DELETE | `/api/blogs/<id>/`          | Delete blog (owner only)   |
| POST   | `/api/comments/`            | Add comment                |
| GET    | `/api/blogs/<id>/comments/` | Blog comments              |

Use `SimpleJWT` or `djoser` for authentication.

---

## 🎨 Frontend (Next.js + Tailwind)

### New Pages

| Path                    | Purpose                |
| ----------------------- | ---------------------- |
| `/login`                | Login form             |
| `/register`             | Registration form      |
| `/profile`              | View/edit user profile |
| `/blog/new`             | Create blog post       |
| `/blog/[slug]/edit`     | Edit blog (owner only) |
| `/blog/[slug]/comments` | View/add comments      |

### 🔐 Auth Handling in Next.js

* Use JWT stored in cookies or localStorage.
* Use React context or Zustand for auth state.
* Use `getServerSideProps()` for protected pages.

---

## 📋 Tasks with Full Steps

---

### ✅ TASK 1: User Module (Register, Login, Profile)

**Backend:**

1. Extend User model (or use default).
2. Setup authentication (JWT via `djoser` or `rest_framework_simplejwt`)
3. Setup `users/serializers.py`, `views.py`, `urls.py`

**Frontend:**

1. Create auth pages `/login`, `/register`
2. Create user profile page `/profile`
3. Store token in cookie/localStorage
4. Setup API service in `utils/api.ts`

---

### ✅ TASK 2: Blog CRUD (Ownership)

**Backend:**

1. Modify `BlogPost` model with `author`
2. Add permission class `IsAuthorOrReadOnly`
3. Update DRF `viewsets` and `routers`
4. Unit tests for permission

**Frontend:**

1. Authenticated route: `/blog/new`
2. Prefill edit form `/blog/[slug]/edit`
3. Conditionally render edit/delete buttons
4. Add confirmation on delete

---

### ✅ TASK 3: Commenting System

**Backend:**

1. Create `Comment` model + serializers + views
2. Route: `/api/comments/`, `/api/blogs/<id>/comments/`
3. Use `IsAuthenticated` for comment creation

**Frontend:**

1. Show comment form if logged in
2. Fetch and list comments under blog detail
3. Display avatar, username, and timestamp

---

### ✅ TASK 4: Auth Integration

**Frontend Steps:**

1. Create React auth context (or Zustand store)
2. Store auth token and user info after login
3. Auto-refresh token (optional)
4. Redirect if not logged in
5. Use `getServerSideProps` for SSR auth protection

---

## 🔄 Suggested Improvements / Best Practices

### 🔐 Security

* Use HTTPS in production
* CSRF protection
* Limit API rate with `drf-throttling`

### 🧪 Testing

* Backend unit tests with `pytest` or `unittest`
* Frontend tests using `Jest` or `Playwright`

### 📈 Performance

* Cache APIs with DRF or Redis
* Image optimization with `next/image`

### 💅 UX Improvements

* Add loading skeletons
* Toast notifications (e.g., react-toastify)
* Markdown preview before publish

---

Would you like me to generate code templates (e.g., `BlogPost` model, `Comment` API, or Login page) for Django or Next.js?
