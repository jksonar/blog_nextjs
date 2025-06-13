# Blog Site Project

A modern blog site with a Django backend API and a Next.js frontend.

## Project Structure

- `django-backend/`: Django REST API backend
- `next-frontend/`: Next.js frontend application

## Backend Setup (Django)

1. Navigate to the backend directory:
   ```
   cd django-backend
   ```

2. Create and activate a virtual environment:
   ```
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install django djangorestframework django-cors-headers Pillow
   ```

4. Apply migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

7. Access the Django admin at: http://localhost:8000/admin/

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```
   cd next-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Access the frontend at: http://localhost:3000

## API Endpoints

- Blog Posts: `/api/posts/`
- Categories: `/api/categories/`
- Tags: `/api/tags/`

## Features

### Backend
- Django REST Framework API
- Blog post, category, and tag models
- Admin interface for content management
- Image upload support

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Responsive design
- Blog listing with filters
- Blog post detail pages
- Category and tag filtering
- Loading states and error handling

## Development Workflow

1. Start both the backend and frontend development servers
2. Create content through the Django admin interface
3. View and interact with the content on the Next.js frontend