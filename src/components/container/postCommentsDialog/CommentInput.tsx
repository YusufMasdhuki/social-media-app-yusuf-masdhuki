'use client';

import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useEffect, useRef, useState } from 'react';

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const createCommentMutation = useCreateComment(postId);
    const isPosting = createCommentMutation.status === 'pending';

    // Handle click outside untuk menutup picker
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          pickerRef.current &&
          !pickerRef.current.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      };

      if (showEmojiPicker) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const handleSubmit = () => {
      const text = comment.trim();
      if (!text) return;
      createCommentMutation.mutate({ text });
      setComment('');
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
      setComment((prev) => prev + emojiData.emoji);
    };

    return (
      <div className='relative mr-5 flex items-center gap-2 pt-3 max-md:border-t max-md:border-neutral-800 md:pt-4'>
        {/* Tombol emoji */}
        <Button
          size='icon'
          variant='secondary'
          type='button'
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className='text-neutral-25 aspect-square h-12 w-12 rounded-xl hover:text-neutral-200'
        >
          <Smile size={24} />
        </Button>
        <div className='relative flex w-full items-center gap-2'>
          {/* Input komentar */}
          <Input
            ref={ref}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder || 'Add a comment...'}
            className='text-md h-12 flex-1 rounded-md border border-neutral-900 pr-20 text-white'
          />

          {/* Tombol Post */}
          <Button
            disabled={!comment.trim() || isPosting}
            variant='text'
            onClick={handleSubmit}
            className='text-primary-200 absolute top-1/2 right-4 h-7 -translate-y-1/2 px-0'
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>

        {/* Popup Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              ref={pickerRef}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className='absolute right-4 bottom-18 z-50 w-[320px]'
            >
              <div className='flex justify-end'>
                <Button
                  size='icon'
                  variant='icon'
                  onClick={() => setShowEmojiPicker(false)}
                  className='text-neutral-25 hover:text-neutral-200'
                >
                  <X size={16} />
                </Button>
              </div>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width='100%'
                height={350}
                theme={Theme.DARK}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CommentInput.displayName = 'CommentInput';
