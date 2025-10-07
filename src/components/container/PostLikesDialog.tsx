'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGetPostLikes } from '@/hooks/likes/useGetPostLikes';

import LikeUserItem from './LikeUserItem';

interface PostLikesDialogProps {
  postId: number;
  trigger: React.ReactNode;
}

function PostLikesDialog({ postId, trigger }: PostLikesDialogProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetPostLikes(postId, 20);

  // 👇 Intersection Observer
  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allLikes = data?.pages.flatMap((page) => page.data.users) ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='pointer-events-none max-h-[60vh] w-full max-w-[548px] gap-0 border-none bg-transparent px-4 pt-10 pb-0'>
        <div className='pointer-events-auto rounded-2xl border border-neutral-900 bg-neutral-950 p-5'>
          <DialogHeader className='mb-5'>
            <DialogTitle className='text-xl font-bold'>Likes</DialogTitle>
          </DialogHeader>

          <ScrollArea className='h-[calc(60vh-64px)] pr-4'>
            {status === 'pending' && (
              <div className='flex justify-center py-4'>
                <Loader2 className='animate-spin' />
              </div>
            )}

            {status === 'error' && (
              <p className='text-center text-red-500'>Error loading likes</p>
            )}

            {status === 'success' && (
              <ul className='flex w-full flex-col gap-5'>
                {allLikes.map((user) => (
                  <LikeUserItem key={user.id} user={user} />
                ))}
              </ul>
            )}

            {/* infinite scroll trigger */}
            {hasNextPage && (
              <div ref={ref} className='flex justify-center py-4'>
                {isFetchingNextPage && <Loader2 className='animate-spin' />}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostLikesDialog;
