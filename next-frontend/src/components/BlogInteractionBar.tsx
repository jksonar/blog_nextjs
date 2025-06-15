'use client';

import LikeButton from './LikeButton';
import RatingStars from './RatingStars';

interface BlogInteractionBarProps {
  slug: string;
  likesCount: number;
  userHasLiked: boolean;
  userRating: number | null;
  averageRating: number | null;
}

export default function BlogInteractionBar({
  slug,
  likesCount,
  userHasLiked,
  userRating,
  averageRating
}: BlogInteractionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 border-t border-b border-gray-200 dark:border-gray-800 my-6">
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Like this post</h3>
        <LikeButton 
          slug={slug} 
          initialLikesCount={likesCount || 0} 
          initialUserHasLiked={userHasLiked || false} 
        />
      </div>
      
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rate this post</h3>
        <RatingStars 
          slug={slug} 
          initialRating={userRating} 
          initialAverageRating={averageRating} 
        />
      </div>
    </div>
  );
}