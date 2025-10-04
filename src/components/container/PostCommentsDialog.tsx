'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGetPostById } from '@/hooks/posts/useGetPostById';

import { Input } from '../ui/input';

interface PostCommentsDialogProps {
  postId: number;
  trigger: React.ReactNode;
}

export function PostCommentsDialog({
  postId,
  trigger,
}: PostCommentsDialogProps) {
  const { data, isLoading, isError, error } = useGetPostById(postId);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) return;
    console.log('Send comment:', comment);
    setComment('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='top-[50%] w-full max-w-[1184px] gap-0 border-none !bg-transparent p-0 pt-10'>
        <div className='overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950'>
          <VisuallyHidden>
            <DialogTitle>Comments</DialogTitle>
          </VisuallyHidden>
          {isLoading && (
            <div className='flex h-[60vh] items-center justify-center'>
              <Loader2 className='animate-spin' />
            </div>
          )}
          {isError && (
            <p className='p-6 text-center text-red-500'>
              {error?.message || 'Failed to load comments'}
            </p>
          )}
          {data && (
            <div className='flex h-[70vh] overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950'>
              {/* LEFT: Image */}
              <div className='relative w-[60%]'>
                <Image
                  src={data.data.imageUrl}
                  alt='Post Image'
                  fill
                  className='object-contain'
                />
              </div>

              {/* RIGHT: Comments Section */}
              <div className='flex w-[40%] flex-col bg-neutral-950'>
                {/* Header: avatar + caption */}
                <div className='flex items-start gap-3 border-b border-neutral-800 p-5'>
                  <Image
                    src='/images/default-avatar.png'
                    alt='user avatar'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold'>author</span>
                    <p className='text-sm text-neutral-300'>
                      {data.data.caption}
                    </p>
                  </div>
                </div>

                {/* Scrollable Comments */}
                <ScrollArea className='flex-1 space-y-4 p-5'>
                  <div className='flex items-start gap-3'>
                    <Image
                      src='/images/default-avatar.png'
                      alt='comment user'
                      width={32}
                      height={32}
                      className='rounded-full'
                    />
                    <div>
                      <p className='text-sm'>
                        <span className='font-semibold'>john_doe </span>
                        Nice picture!
                      </p>
                      <p className='mt-1 text-xs text-neutral-500'>2h ago</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Image
                      src='/images/default-avatar.png'
                      alt='comment user'
                      width={32}
                      height={32}
                      className='rounded-full'
                    />
                    <div>
                      <p className='text-sm'>
                        <span className='font-semibold'>sarah_w </span>
                        Amazing vibes 😍
                      </p>
                      <p className='mt-1 text-xs text-neutral-500'>1h ago</p>
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer: input comment */}
                <div className='border-t border-neutral-800 p-4'>
                  <div className='flex items-center gap-3'>
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder='Add a comment...'
                      className='text-sm text-white'
                    />
                    <Button
                      size='sm'
                      disabled={!comment.trim()}
                      onClick={handleSubmit}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
