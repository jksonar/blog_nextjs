import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiCalendar, FiTag, FiFolder } from 'react-icons/fi';
import { BlogPost } from '@/utils/api';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const {
    title,
    slug,
    author,
    category,
    tags,
    created_at,
    featured_image,
  } = post;

  const formattedDate = created_at 
    ? format(new Date(created_at), 'MMMM dd, yyyy') 
    : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48 w-full">
          {featured_image ? (
            <Image
              src={featured_image.startsWith('http') ? featured_image : `http://localhost:8000${featured_image}`}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg">No Image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/blog/${slug}`}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
            {title}
          </h2>
        </Link>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <FiCalendar className="mr-1" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{author.first_name} {author.last_name}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {category && (
            <Link 
              href={`/blog?category=${category.slug}`}
              className="flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
            >
              <FiFolder className="mr-1" />
              {category.name}
            </Link>
          )}
          
          {tags && tags.slice(0, 3).map((tag) => (
            <Link 
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
            >
              <FiTag className="mr-1" />
              {tag.name}
            </Link>
          ))}
        </div>

        <Link 
          href={`/blog/${slug}`}
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Read more →
        </Link>
      </div>
      className="rounded-t-lg"
    </div>
  );
};

export default BlogCard;