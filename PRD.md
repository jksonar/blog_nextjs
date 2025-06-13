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
├── pages/
│   ├── index.tsx                # Homepage
│   ├── blog/
│   │   └── [slug].tsx           # Blog details
│   └── 404.tsx
├── components/
│   ├── BlogCard.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── styles/
│   └── globals.css
├── tailwind.config.js
├── next.config.js
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

Would you like me to:

* Scaffold this project (with code templates)?
* Write sample models or API views?
* Help deploy it on a VPS or server?

Let me know how you'd like to proceed.
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
├── components/            # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
├── pages/                 # Next.js routes
│   ├── index.tsx          # Homepage
│   ├── blog/              # Blog routes
│   │   └── [slug].tsx     # Dynamic blog detail page
│   └── 404.tsx
├── public/                # Static assets like logos, icons
├── styles/                # Global CSS
│   └── globals.css
├── utils/                 # Helper functions
│   └── api.ts             # Axios instance or fetch helpers
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
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
