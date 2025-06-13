Here is a **Product Requirements Document (PRD)** for a **Blog Website** with:

* **Django backend** (API + Admin Panel)
* **Next.js frontend**
* **Tailwind CSS for styling**

---

## 📝 Product Requirements Document – Blog Website

---

### 1. **Overview**

Build a modern blog platform where:

* Admins can manage blogs using Django Admin.
* Users can read blog posts on a fast, interactive frontend built with Next.js.
* Styling is handled via Tailwind CSS.
* Django provides RESTful APIs to serve blog content.

---

### 2. **Goals**

* Admin-friendly interface for managing blog content.
* Fast, SEO-friendly blog frontend (Next.js SSR/ISR).
* Clean, responsive UI using Tailwind CSS.
* Decoupled backend and frontend for scalability and maintainability.

---

### 3. **Technical Stack**

| Layer    | Tech Stack              |
| -------- | ----------------------- |
| Frontend | Next.js (with Tailwind) |
| Backend  | Django (with DRF)       |
| Styling  | Tailwind CSS            |
| API      | Django REST Framework   |
| Admin    | Django Admin            |
| Database | PostgreSQL / SQLite     |

---

### 4. **User Roles**

#### 1. **Admin**

* Login to Django Admin
* Add/Edit/Delete blog posts
* Upload images
* Schedule posts

#### 2. **Visitor**

* View blog posts
* Search/filter by tag/category
* Read single blog post
* Share via social media

---

### 5. **Features**

#### Backend (Django + DRF)

* `BlogPost` model with:

  * Title
  * Slug
  * Content (Rich Text)
  * Author
  * Tags
  * Category
  * Published flag
  * Created/Updated timestamps
  * Featured image
  * Scheduled publish datetime

* API Endpoints:

  * `GET /api/blogs/` – List blogs
  * `GET /api/blogs/<slug>/` – Blog details
  * `GET /api/tags/` – Tags list
  * `GET /api/categories/` – Categories list

#### Frontend (Next.js + Tailwind)

* Blog listing page
* Blog detail page
* Tag/category filters
* Responsive design
* Dynamic routing (`/blog/[slug].tsx`)
* SEO metadata per blog
* 404 page for non-existent posts
* Loading skeletons

---

### 6. **Project Structure**

#### `django-backend/`

```
django-backend/
├── blogsite/            # Django project root
│   ├── settings.py
│   ├── urls.py
├── blog/                # App: blog API and models
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
├── media/               # Uploaded images
├── manage.py
```

#### `next-frontend/`

```
next-frontend/
├── public/                        # Static assets
├── src/
│   ├── app/                       # App Router
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Blog detail
│   │   └── not-found.tsx         # 404 Page
│   ├── components/               # UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BlogCard.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.ts                # Axios or fetch helpers
├── tailwind.config.js
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

### 7. **Integration**

* Django will expose REST APIs using DRF.
* Next.js will call these APIs using `fetch()` or `axios`.
* CORS to be enabled in Django (`django-cors-headers`).
* Image uploads served via Django (`MEDIA_URL`, `MEDIA_ROOT`).

---

### 8. **Optional Enhancements (Future Scope)**

* Authentication (JWT) for user comments or author login
* Markdown support
* Rich text editor in Django Admin (e.g., CKEditor)
* Pagination, infinite scroll
* RSS feed
* Sitemap generation

---
To create the frontend structure for your **Next.js + Tailwind CSS** project, follow these steps:

---

## ✅ Step-by-Step: Setup Frontend with Next.js & Tailwind

### 1. **Create Next.js App**

```bash
npx create-next-app@latest next-frontend --typescript
cd next-frontend
```

✅ This creates a Next.js project with TypeScript support.

---

### 2. **Install Tailwind CSS**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### 3. **Configure Tailwind**

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Then update `./styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 4. **Recommended Folder Structure**

Here’s how your frontend should be structured:

```
next-frontend/
├── public/                        # Static assets
├── src/
│   ├── app/                       # App Router
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Blog detail
│   │   └── not-found.tsx         # 404 Page
│   ├── components/               # UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BlogCard.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.ts                # Axios or fetch helpers
├── tailwind.config.js
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

### 5. **Add Axios for API Calls (Optional)**

```bash
npm install axios
```

Create helper in `utils/api.ts`:

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
})
```

Set the environment variable in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### 6. **Run the App**

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

Let me know if you’d like:

* A sample `BlogCard.tsx` or blog detail page
* Tailwind UI integration
* CI/CD or deployment steps
---
Great! Since you're going with the **modern default best practices in Next.js** (i.e., using `src/`, the **App Router**, and Tailwind CSS), here’s your **updated Product Requirements Document (PRD)** reflecting the correct architecture.

---

## 📝 Product Requirements Document (PRD) – Blog Website (Modern Next.js + Django API)

---

### 1. **Overview**

Build a blog platform with:

* **Backend**: Django + Django REST Framework for API and Admin
* **Frontend**: Next.js (modern App Router + Tailwind CSS)
* **Styling**: Tailwind CSS
* **API Communication**: Next.js fetches blog data from Django APIs
* **Admin Panel**: Managed via Django Admin

---

### 2. **Goals**

* Clean separation of concerns with decoupled frontend and backend.
* Fast, modern, SEO-friendly blog experience with interactive UI.
* Admin-friendly interface for managing blog content.

---

### 3. **Tech Stack**

| Layer      | Stack                          |
| ---------- | ------------------------------ |
| Frontend   | Next.js (App Router, `src/`)   |
| Backend    | Django + Django REST Framework |
| Styling    | Tailwind CSS                   |
| Database   | PostgreSQL / SQLite            |
| API Format | REST (JSON)                    |
| Admin      | Django Admin                   |

---

### 4. **User Roles**

#### 1. **Admin**

* Login via Django Admin
* Add/Edit/Delete blog posts, images, tags, categories
* Set publish date and featured status

#### 2. **User**

* View blog listings and individual posts
* Filter by category or tag
* Share content on social media

---

### 5. **Features**

#### Backend (Django + DRF)

* **Models**

  * `BlogPost`: title, slug, content (HTML/Markdown), author, tags, category, published flag, created/updated timestamps, featured image
  * `Tag`, `Category`: for filtering/grouping

* **API Endpoints**

  * `GET /api/blogs/` – Blog listing
  * `GET /api/blogs/<slug>/` – Blog detail
  * `GET /api/tags/` – List of tags
  * `GET /api/categories/` – List of categories

#### Frontend (Next.js + Tailwind)

* App Router structure under `src/app/`
* Dynamic routes for blogs: `src/app/blog/[slug]/page.tsx`
* Blog listing page: `src/app/blog/page.tsx`
* Home page: `src/app/page.tsx`
* Tag/category filters (client or server side)
* 404 handling: `src/app/not-found.tsx`
* Responsive, accessible UI

---

### 6. **Project Structure**

#### 📁 Django Backend

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

#### 📁 Next.js Frontend (Modern)

```
next-frontend/
├── public/                        # Static assets
├── src/
│   ├── app/                       # App Router
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Blog detail
│   │   └── not-found.tsx         # 404 Page
│   ├── components/               # UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BlogCard.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.ts                # Axios or fetch helpers
├── tailwind.config.js
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

### 7. **Integration Details**

* Django APIs exposed at `http://localhost:8000/api/`
* Next.js uses `fetch()` or `axios` from `NEXT_PUBLIC_API_URL`
* Use `CORS` in Django (`django-cors-headers`)
* Serve uploaded images via Django’s `MEDIA_URL`
* `.env.local` in frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### 8. **Optional Enhancements**

* Blog search
* Comment system
* Login for authors or readers
* Pagination or infinite scroll
* RSS and sitemap generation
* Rich text/Markdown editor
* Dark mode (Tailwind-based)

---

