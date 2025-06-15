import Link from 'next/link';
import { fetchCategories } from '@/utils/api';
import { FiFolder } from 'react-icons/fi';

export const metadata = {
  title: 'Blog Categories - Blog Site',
  description: 'Browse all blog categories',
};

export default async function CategoriesPage() {
  const categoriesData = await fetchCategories().catch(() => ({ results: [] }));
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.results || []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog Categories
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse all our blog posts by category
        </p>
      </div>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/blog?category=${category.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                  <FiFolder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                View all posts in this category
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back later for new categories.
          </p>
          <Link 
            href="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
}