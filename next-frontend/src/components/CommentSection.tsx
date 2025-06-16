'use client';

import { useState, useEffect } from 'react';
import { fetchComments, createComment, updateComment, deleteComment, Comment } from '@/utils/api';
import { FiUser, FiClock, FiMessageSquare, FiEdit, FiTrash, FiSend, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

interface CommentSectionProps {
  slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when component mounts
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchComments(slug);
        setComments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [slug]);

  // Handle new comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const data = await createComment(slug, newComment);
      setComments([...comments, data]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reply submission
  const handleSubmitReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsLoading(true);
    try {
      const data = await createComment(slug, replyContent, parentId);
      
      // Update the comments state with the new reply
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), data]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setReplyTo(null);
      setReplyContent('');
      setError(null);
    } catch (err) {
      setError('Failed to post reply. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle comment update
  const handleUpdateComment = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      const data = await updateComment(commentId, editContent);
      
      // Update the comments state with the edited comment
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: data.content };
        }
        
        // Check if the comment is in replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, content: data.content };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      });
      
      setComments(updatedComments);
      setEditingComment(null);
      setEditContent('');
      setError(null);
    } catch (err) {
      setError('Failed to update comment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: number, parentId?: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsLoading(true);
    try {
      await deleteComment(commentId);
      
      // If it's a reply, update the parent comment's replies
      if (parentId) {
        const updatedComments = comments.map(comment => {
          if (comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        // If it's a top-level comment, remove it from the comments array
        setComments(comments.filter(comment => comment.id !== commentId));
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render a single comment
  const renderComment = (comment: Comment, isReply = false, parentId?: number) => {
    const formattedDate = format(new Date(comment.created_at), 'MMM dd, yyyy h:mm a');
    
    return (
      <div 
        key={comment.id} 
        className={`p-4 rounded-lg ${isReply ? 'ml-8 mt-2 bg-gray-50 dark:bg-gray-800' : 'border border-gray-200 dark:border-gray-700 mb-4'}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
              <FiUser />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.user.first_name} {comment.user.last_name || comment.user.username}
              </h4>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FiClock className="mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditingComment(comment.id);
                setEditContent(comment.content);
              }}
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Edit comment"
            >
              <FiEdit size={16} />
            </button>
            <button 
              onClick={() => handleDeleteComment(comment.id, parentId)}
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Delete comment"
            >
              <FiTrash size={16} />
            </button>
          </div>
        </div>
        
        {editingComment === comment.id ? (
          <form onSubmit={(e) => handleUpdateComment(e, comment.id)} className="mt-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              required
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                disabled={isLoading}
              >
                <FiSend className="mr-1" /> Update
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-2 text-gray-800 dark:text-gray-200">
            {comment.content}
          </div>
        )}
        
        {!isReply && (
          <div className="mt-3">
            {replyTo === comment.id ? (
              <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                  required
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center"
                  >
                    <FiX className="mr-1" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                    disabled={isLoading}
                  >
                    <FiSend className="mr-1" /> Reply
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiMessageSquare className="mr-1" /> Reply
              </button>
            )}
          </div>
        )}
        
        {/* Render replies */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
      
      {/* New comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={4}
          required
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            <FiSend className="mr-2" /> Post Comment
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Comments list */}
      <div>
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}