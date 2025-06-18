### Product Requirements Document (PRD) – Blog Website

### 1. Overview

A modern blog platform with:

* Backend in **Django + DRF**
* Frontend in **Next.js (App Router) + Tailwind CSS**
* Clean, SEO-optimized, responsive design
* Admin interface for managing blog content via Django Admin
* Dynamic blog post rendering with filtering
* User-generated content (UGC) and user authentication.
* Users can register, log in/out, reset passwords.
* Authenticated users can create, update, delete their own blog posts.
* Authenticated users can create, update, delete their own comments.
* Authenticated users can like, dislike, and rate blog posts.
* All users can comment on any blog post.
* Each user has a profile page.
* Comments with replies.
* Interactive features (likes, ratings, rich text).
* search filter by category, tag, author, date, etc.

### 2. Goals

* Decoupled frontend-backend architecture
* Fast-loading, SEO-optimized, accessible frontend
* Robust admin interface
* Extensible architecture (future features: comments, login, search)

### 3. Tech Stack

| Layer    | Tech                      |
| -------- | ------------------------- |
| Frontend | Next.js (App Router)      |
| Styling  | Tailwind CSS              |
| Backend  | Django + Django REST      |
| Database | PostgreSQL / SQLite       |
| Admin    | Django Admin              |
| API      | REST (JSON)               |
| Auth     | JWT or Session Auth       |

### 4. User Roles

#### Admin

* Login via Django Admin
* Manage blog posts (create/edit/delete)
* Upload images
* Set featured and scheduled publish datetime
* Full access to Django Admin
* Manage all blogs, users, comments, ratings

#### Visitor

* Browse blog posts
* Read individual blogs
* Filter by tag/category
* Share posts (social media)

#### Authenticated User

* Register/login/logout/reset password
* Create, edit, delete own blog posts
* Comment on any post and reply to comments
* Like, dislike, and rate any blog
* Manage own profile (avatar, bio, etc.)

### 5. Features

#### Backend (Django + DRF)

* `BlogPost`, `Category`, `Tag` models
* Rich Text/Markdown support
* API Endpoints:
    * `GET /api/blogs/` – List all blogs
    * `GET /api/blogs/<slug>/` – Blog detail
    * `GET /api/categories/` – Categories list
    * `GET /api/tags/` – Tags list

#### Frontend (Next.js)

* Homepage (latest blogs)
* Blog listing (`/blog`)
* Blog detail (`/blog/[slug]`)
* Category and Tag filter
* SEO metadata per blog
* 404 page and loading skeletons
* Responsive layout with Tailwind

#### User Module

* User Registration
* Login / Logout
* Password Reset (email or token-based)
* Profile view/edit
* User Avatar (optional)
* JWT or Session Auth

#### Blog Ownership (UGC)

* Users can **add/update/delete only their own blog posts**
* Blog model has `author = ForeignKey(User)`
* Blogs are only **editable by the author**
* Admins can manage all blogs via Django Admin

#### Comment System

* Comment model: blog, user, text, timestamps
* Anyone logged in can comment on any blog
* Optional: threaded comments / moderation

#### New Models

##### `User` (extend with `AbstractUser` or `OneToOne` profile)

```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
```

##### `BlogPost` (add `author` relation)

```python
author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

##### `Comment`

```python
class Comment(models.Model):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
```

#### Auth & Permissions (DRF)

* Use `IsAuthenticated` or custom permissions like:

```python
class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user
```

#### API Endpoints (New)

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/api/auth/register/` | Register user                  |
| POST   | `/api/auth/login/`    | Login                          |
| POST   | `/api/auth/logout/`   | Logout                         |
| POST   | `/api/auth/reset/`    | Request password reset         |
| GET    | `/api/users/me/`      | Authenticated user profile     |
| PATCH  | `/api/users/me/`      | Update profile                 |
| POST   | `/api/blogs/`          | Create blog                    |
| PUT    | `/api/blogs/<id>/`    | Update blog (owner only)       |
| DELETE | `/api/blogs/<id>/`    | Delete blog (owner only)       |
| POST   | `/api/comments/`      | Add comment                    |
| GET    | `/api/blogs/<id>/comments/` | Blog comments                  |

Use `SimpleJWT` or `djoser` for authentication.

#### New Pages

| Path                  | Purpose                  |
| --------------------- | ------------------------ |
| `/login`              | Login form               |
| `/register`           | Registration form        |
| `/profile`            | View/edit user profile   |
| `/blog/new`            | Create blog post         |
| `/blog/[slug]/edit`    | Edit blog (owner only)   |
| `/blog/[slug]/comments` | View/add comments        |

#### Auth Handling in Next.js

* Use JWT stored in cookies or localStorage.
* Use React context or Zustand for auth state.
* Use `getServerSideProps()` for protected pages.

#### API Endpoints (DRF)

##### Auth

```
POST     /api/auth/register/
POST     /api/auth/login/
POST     /api/auth/logout/
POST     /api/auth/reset-password/
GET/PUT  /api/profile/           # Profile info
```

##### Blog

```
GET      /api/blogs/
POST     /api/blogs/                  # Auth required
GET      /api/blogs/<slug>/
PUT      /api/blogs/<slug>/           # Owner only
DELETE   /api/blogs/<slug>/           # Owner only
```

##### Comments

```
GET      /api/comments/?post_id=<id>
POST     /api/comments/                  # Auth required
PUT      /api/comments/<id>/           # Owner only
DELETE   /api/comments/<id>/           # Owner only
```

##### Interactions

```
POST     /api/blogs/<id>/like/
POST     /api/blogs/<id>/dislike/
POST     /api/blogs/<id>/rate/          # payload: { rating: 1-5 }
```

#### Frontend – Next.js (App Router)

##### Pages

* `src/app/login/page.tsx`
* `src/app/register/page.tsx`
* `src/app/profile/page.tsx`
* `src/app/blog/page.tsx` – blog list
* `src/app/blog/create/page.tsx` – new blog (rich text editor)
* `src/app/blog/[slug]/page.tsx` – blog detail + comments
* `src/app/blog/edit/[slug]/page.tsx` – edit blog

##### Features

* Use `fetch` or `axios` with `Authorization: Bearer <token>`
* State management: `useContext` or `zustand`
* Rich text editor: e.g., [React Quill](https://github.com/zenoamaro/react-quill)
* Interactive:
    * Like/dislike buttons
    * 5-star rating component
    * Comment form & replies

### 6. Project Structure

#### Django Backend

```
django-backend/
├── blogsite/
│   └── settings.py, urls.py
├── blog/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
├── media/
└── manage.py
```

#### Next.js Frontend

```
next-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BlogCard.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── styles/
│   │   └── globals.css
├── .env.local
└── tailwind.config.js
```

### 7. Task Breakdown with Detailed Steps

#### TASK 1: Backend Setup – Django + DRF

**Steps:**

1.  Install Django and DRF:

    ```bash
    pip install django djangorestframework django-cors-headers Pillow
    ```
2.  Create project and app:

    ```bash
    django-admin startproject blogsite
    cd blogsite
    python manage.py startapp blog
    ```
3.  Register app in `settings.py`
4.  Add and configure:
    * `corsheaders`
    * `rest_framework`
    * `blog`
    * `MEDIA_URL`, `MEDIA_ROOT`
5.  Create models:
    * `Category`, `Tag`, `BlogPost`
6.  Create serializers:
    * `BlogPostSerializer`, `CategorySerializer`, `TagSerializer`
7.  Create views using `ListAPIView`, `RetrieveAPIView`
8.  Add `urls.py` for `blog/` app and register in main `urls.py`
9.  Test API endpoints via Postman or browser
10. Create superuser:

    ```bash
    python manage.py createsuperuser
    ```

#### TASK 2: Frontend Setup – Next.js + Tailwind CSS

**Steps:**

1.  Create app:

    ```bash
    npx create-next-app@latest next-frontend --typescript --tailwind
    ```
2.  Configure Tailwind (`tailwind.config.js` + `globals.css`)
3.  Setup folder structure under `src/`
4.  Create `Navbar.tsx`, `Footer.tsx`, `BlogCard.tsx` in `components/`
5.  Setup `api.ts` in `utils/` for Axios:

    ```ts
    export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
    ```

#### TASK 3: Blog Listing Page – `/blog`

**Steps:**

1.  Create `src/app/blog/page.tsx`
2.  Fetch blog list from API on server side
3.  Map through blogs and render using `BlogCard.tsx`
4.  Add Tailwind styling
5.  Add tag/category filters (dropdown or buttons)
6.  Handle loading and empty states

#### TASK 4: Blog Detail Page – `/blog/[slug]`

**Steps:**

1.  Create `src/app/blog/[slug]/page.tsx`
2.  Use dynamic routing to fetch blog by slug
3.  Render content (HTML or Markdown)
4.  Add metadata for SEO via `metadata` export
5.  Add social share buttons

#### TASK 5: Add Categories and Tags

**Steps:**

1.  Create `Category` and `Tag` models in Django
2.  Add admin support and serializers
3.  Fetch via API and show filter options in frontend
4.  Allow filtering logic in frontend:
    * Append query params
    * Filter blogs on click

#### TASK 6: Admin Panel Setup

**Steps:**

1.  Register models with `admin.site.register`
2.  Customize `BlogPostAdmin` for:
    * Prepopulated slug
    * Filter by category/tag
    * Image preview (optional)
3.  Add CKEditor (optional rich text editor):

    ```bash
    pip install django-ckeditor
    ```

#### TASK 7: Image Upload + Display

**Steps:**

1.  Add `ImageField` in model
2.  Configure `MEDIA_URL` and `MEDIA_ROOT`
3.  Serve media in development
4.  Display image in frontend blog card and detail page

#### TASK 8: 404 + Skeleton Loaders

**Steps:**

1.  Create `src/app/not-found.tsx`
2.  Use Next.js `notFound()` function in blog detail
3.  Create reusable `SkeletonCard.tsx`
4.  Show loaders during data fetch

#### TASK 9: Environment Config & CORS

**Steps:**

1.  Add `.env.local` to frontend:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
2.  Add `django-cors-headers` to backend:

    ```py
    CORS_ALLOW_ALL_ORIGINS = True  # or specify frontend domain
    ```

#### TASK 10: Deployment (Optional)

**Steps:**

1.  Use Vercel for frontend deployment
2.  Use Render.com or Railway for Django backend
3.  Configure domains, SSL, and environment vars
4.  Add CI/CD workflows for auto deployment (GitHub Actions or Vercel)

#### ✅ TASK 1: User Module (Register, Login, Profile)

**Backend:**

1.  Extend User model (or use default).
2.  Setup authentication (JWT via `djoser` or `rest_framework_simplejwt`)
3.  Setup `users/serializers.py`, `views.py`, `urls.py`

**Frontend:**

1.  Create auth pages `/login`, `/register`
2.  Create user profile page `/profile`
3.  Store token in cookie/localStorage
4.  Setup API service in `utils/api.ts`

#### ✅ TASK 2: Blog CRUD (Ownership)

**Backend:**

1.  Modify `BlogPost` model with `author`
2.  Add permission class `IsAuthorOrReadOnly`
3.  Update DRF `viewsets` and `routers`
4.  Unit tests for permission

**Frontend:**

1.  Authenticated route: `/blog/new`
2.  Prefill edit form `/blog/[slug]/edit`
3.  Conditionally render edit/delete buttons
4.  Add confirmation on delete

#### ✅ TASK 3: Commenting System

**Backend:**

1.  Create `Comment` model + serializers + views
2.  Route: `/api/comments/`, `/api/blogs/<id>/comments/`
3.  Use `IsAuthenticated` for comment creation

**Frontend:**

1.  Show comment form if logged in
2.  Fetch and list comments under blog detail
3.  Display avatar, username, and timestamp

#### ✅ TASK 4: Auth Integration

**Frontend Steps:**

1.  Create React auth context (or Zustand store)
2.  Store auth token and user info after login
3.  Auto-refresh token (optional)
4.  Redirect if not logged in
5.  Use `getServerSideProps` for SSR auth protection

### 8. Best Practices & Suggestions

#### Security

* Use HTTPS in production
* CSRF protection
* Limit API rate with `drf-throttling`

#### Testing

* Backend unit tests with `pytest` or `unittest`
* Frontend tests using `Jest` or `Playwright`

#### Performance

* Cache APIs with DRF or Redis
* Image optimization with `next/image`

#### UX/UI

* Toasts for success/error
* Skeleton loaders for API data
* Responsive layout
* Form validation (Formik + Yup or React Hook Form)

#### Backend

* Use `permissions.IsAuthenticatedOrReadOnly`
* Custom `permissions.IsOwner` for blog ownership
* Paginate blog list & comments
* Use `ckeditor` or `django-ckeditor` in admin

### 9. Suggested Task Breakdown

#### Phase 1: User Authentication

* [ ] Set up `djoser` or custom auth endpoints
* [ ] Enable JWT auth
* [ ] Create login, register, reset password forms in frontend
* [ ] Build profile page (view & edit user info)

#### Phase 2: Blog CRUD

* [ ] Build Django blog model and serializer
* [ ] Add ownership check (only author can edit/delete)
* [ ] Create APIs (GET, POST, PUT