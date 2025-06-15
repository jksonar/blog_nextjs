'use client';

import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { likeBlogPost, unlikeBlogPost } from '@/utils/api';

interface LikeButtonProps {
  slug: string;
  initialLikesCount: number;
  initialUserHasLiked: boolean;
}

export default function LikeButton({ 
  slug, 
  initialLikesCount, 
  initialUserHasLiked 
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLikeToggle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (userHasLiked) {
        await unlikeBlogPost(slug);
        setLikesCount(prev => prev - 1);
        setUserHasLiked(false);
      } else {
        await likeBlogPost(slug);
        setLikesCount(prev => prev + 1);
        setUserHasLiked(true);
      }
    } catch (err) {
      setError('You need to be logged in to like posts');
      console.error('Error toggling like:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLikeToggle}
        disabled={isLoading}
        className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${userHasLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-red-500'}`}
        aria-label={userHasLiked ? 'Unlike post' : 'Like post'}
      >
        <FiHeart 
          className={`w-6 h-6 ${userHasLiked ? 'fill-current' : ''}`} 
        />
        <span className="text-sm font-medium">{likesCount}</span>
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}