'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();

  return (
    <div className="mt-12 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isCurrentPage = pageNum === currentPage;
          
          // Create query string manually
          let queryString = '';
          // Add existing query params except page
          searchParams.forEach((value, key) => {
            if (key !== 'page') {
              if (queryString) queryString += '&';
              queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
          });
          // Add page param
          if (queryString) queryString += '&';
          queryString += `page=${pageNum}`;
          
          return (
            <Link
              key={pageNum}
              href={`/blog?${queryString}`}
              className={`px-4 py-2 text-sm font-medium ${isCurrentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}