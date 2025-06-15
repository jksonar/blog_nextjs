Here is the **updated PRD** along with a **full task breakdown** including detailed steps per task. This ensures clarity, trackability, and ease of collaboration across development.

---

## ✅ Product Requirements Document (PRD) – Blog Website (Updated)

---

### 1. 🧭 Overview

A **modern blog platform** with:

* Backend in **Django + DRF**
* Frontend in **Next.js (App Router) + Tailwind CSS**
* Clean, SEO-optimized, responsive design
* Admin interface for managing blog content via Django Admin
* Dynamic blog post rendering with filtering

---

### 2. 🎯 Goals

* Decoupled frontend-backend architecture
* Fast-loading, SEO-optimized, accessible frontend
* Robust admin interface
* Extensible architecture (future features: comments, login, search)

---

### 3. 🧱 Tech Stack

| Layer    | Tech                 |
| -------- | -------------------- |
| Frontend | Next.js (App Router) |
| Styling  | Tailwind CSS         |
| Backend  | Django + Django REST |
| Database | PostgreSQL / SQLite  |
| Admin    | Django Admin         |
| API      | REST (JSON)          |

---

### 4. 👥 User Roles

#### Admin

* Login via Django Admin
* Manage blog posts (create/edit/delete)
* Upload images
* Set featured and scheduled publish datetime

#### Visitor

* Browse blog posts
* Read individual blogs
* Filter by tag/category
* Share posts (social media)

---

### 5. 🚀 Features

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

---

### 6. 📁 Project Structure

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

---

## 🧩 Task Breakdown with Detailed Steps

---

### 🔹 TASK 1: Backend Setup – Django + DRF

**Steps:**

1. Install Django and DRF:

   ```bash
   pip install django djangorestframework django-cors-headers Pillow
   ```
2. Create project and app:

   ```bash
   django-admin startproject blogsite
   cd blogsite
   python manage.py startapp blog
   ```
3. Register app in `settings.py`
4. Add and configure:

   * `corsheaders`
   * `rest_framework`
   * `blog`
   * `MEDIA_URL`, `MEDIA_ROOT`
5. Create models:

   * `Category`, `Tag`, `BlogPost`
6. Create serializers:

   * `BlogPostSerializer`, `CategorySerializer`, `TagSerializer`
7. Create views using `ListAPIView`, `RetrieveAPIView`
8. Add `urls.py` for `blog/` app and register in main `urls.py`
9. Test API endpoints via Postman or browser
10. Create superuser:

```bash
python manage.py createsuperuser
```

---

### 🔹 TASK 2: Frontend Setup – Next.js + Tailwind CSS

**Steps:**

1. Create app:

   ```bash
   npx create-next-app@latest next-frontend --typescript --tailwind
   ```
2. Configure Tailwind (`tailwind.config.js` + `globals.css`)
3. Setup folder structure under `src/`
4. Create `Navbar.tsx`, `Footer.tsx`, `BlogCard.tsx` in `components/`
5. Setup `api.ts` in `utils/` for Axios:

   ```ts
   export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
   ```

---

### 🔹 TASK 3: Blog Listing Page – `/blog`

**Steps:**

1. Create `src/app/blog/page.tsx`
2. Fetch blog list from API on server side
3. Map through blogs and render using `BlogCard.tsx`
4. Add Tailwind styling
5. Add tag/category filters (dropdown or buttons)
6. Handle loading and empty states

---

### 🔹 TASK 4: Blog Detail Page – `/blog/[slug]`

**Steps:**

1. Create `src/app/blog/[slug]/page.tsx`
2. Use dynamic routing to fetch blog by slug
3. Render content (HTML or Markdown)
4. Add metadata for SEO via `metadata` export
5. Add social share buttons

---

### 🔹 TASK 5: Add Categories and Tags

**Steps:**

1. Create `Category` and `Tag` models in Django
2. Add admin support and serializers
3. Fetch via API and show filter options in frontend
4. Allow filtering logic in frontend:

   * Append query params
   * Filter blogs on click

---

### 🔹 TASK 6: Admin Panel Setup

**Steps:**

1. Register models with `admin.site.register`
2. Customize `BlogPostAdmin` for:

   * Prepopulated slug
   * Filter by category/tag
   * Image preview (optional)
3. Add CKEditor (optional rich text editor):

   ```bash
   pip install django-ckeditor
   ```

---

### 🔹 TASK 7: Image Upload + Display

**Steps:**

1. Add `ImageField` in model
2. Configure `MEDIA_URL` and `MEDIA_ROOT`
3. Serve media in development
4. Display image in frontend blog card and detail page

---

### 🔹 TASK 8: 404 + Skeleton Loaders

**Steps:**

1. Create `src/app/not-found.tsx`
2. Use Next.js `notFound()` function in blog detail
3. Create reusable `SkeletonCard.tsx`
4. Show loaders during data fetch

---

### 🔹 TASK 9: Environment Config & CORS

**Steps:**

1. Add `.env.local` to frontend:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
2. Add `django-cors-headers` to backend:

   ```py
   CORS_ALLOW_ALL_ORIGINS = True  # or specify frontend domain
   ```

---

### 🔹 TASK 10: Deployment (Optional)

**Steps:**

1. Use Vercel for frontend deployment
2. Use Render.com or Railway for Django backend
3. Configure domains, SSL, and environment vars
4. Add CI/CD workflows for auto deployment (GitHub Actions or Vercel)

---

## 📌 Bonus: Future Scope

* Add Comments (JWT auth or anonymous)
* Markdown blog writing support
* Sitemap + RSS Feed (SEO)
* Blog search (text search or filter)
* Dark mode with Tailwind
* Pagination or infinite scroll

---

