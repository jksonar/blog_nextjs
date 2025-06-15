'use client';

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { rateBlogPost } from '@/utils/api';

interface RatingStarsProps {
  slug: string;
  initialRating: number | null;
  initialAverageRating: number | null;
}

export default function RatingStars({ 
  slug, 
  initialRating, 
  initialAverageRating 
}: RatingStarsProps) {
  const [userRating, setUserRating] = useState<number | null>(initialRating);
  const [averageRating, setAverageRating] = useState<number | null>(initialAverageRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRating = async (value: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await rateBlogPost(slug, value);
      setUserRating(value);
      setAverageRating(response.average_rating);
    } catch (err) {
      setError('You need to be logged in to rate posts');
      console.error('Error rating post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={isLoading}
            className="p-1 focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            <FiStar 
              className={`w-6 h-6 transition-colors ${getFillClass(star, userRating, hoveredRating)}`} 
            />
          </button>
        ))}
      </div>
      
      {averageRating !== null && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Average: {averageRating.toFixed(1)}
        </div>
      )}
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function getFillClass(star: number, userRating: number | null, hoveredRating: number | null): string {
  if (hoveredRating !== null) {
    return star <= hoveredRating 
      ? 'text-yellow-400 fill-current' 
      : 'text-gray-300 dark:text-gray-600';
  }
  
  if (userRating !== null) {
    return star <= userRating 
      ? 'text-yellow-400 fill-current' 
      : 'text-gray-300 dark:text-gray-600';
  }
  
  return 'text-gray-300 dark:text-gray-600';
}