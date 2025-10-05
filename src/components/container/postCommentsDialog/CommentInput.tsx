'use client';

import { forwardRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useCreateComment } from '@/hooks/comments/useCreateComment';

interface CommentInputProps {
  postId: number;
  placeholder?: string;
}

export const CommentInput = forwardRef<HTMLInputElement, CommentInputProps>(
  ({ postId, placeholder }, ref) => {
    const [comment, setComment] = useState('');
    const createCommentMutation = useCreateComment(postId);

    const isPosting = createCommentMutation.status === 'pending';

    const handleSubmit = () => {
      const text = comment.trim();
      if (!text) return;

      createCommentMutation.mutate({ text });
      setComment('');
    };

    return (
      <div className='border-t border-neutral-800 p-4'>
        <div className='flex items-center gap-3'>
          <Input
            ref={ref}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder || 'Add a comment...'}
            className='text-sm text-white'
          />
          <Button
            size='sm'
            disabled={!comment.trim() || isPosting}
            onClick={handleSubmit}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    );
  }
);

CommentInput.displayName = 'CommentInput';
