'use client';

import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allLikes = data?.pages.flatMap((page) => page.data.users) ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='pointer-events-none fixed right-0 left-0 flex items-end justify-center border-none bg-transparent p-0 pt-10 max-md:bottom-0 md:w-[548px] md:items-center md:px-4'>
        <AnimatePresence mode='wait'>
          <motion.div
            key='likes-modal'
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`pointer-events-auto max-h-[60vh] w-full overflow-hidden rounded-t-2xl border border-neutral-900 bg-neutral-950 p-4 pr-0 shadow-lg md:w-[548px] md:rounded-2xl md:p-5`}
          >
            <DialogHeader className='mb-3 md:mb-5'>
              <DialogTitle className='text-md text-start font-bold md:text-xl'>
                Likes
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className='h-[calc(60vh-80px)] overflow-hidden pr-4 md:pr-5'>
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

              {hasNextPage && (
                <div ref={ref} className='flex justify-center py-4'>
                  {isFetchingNextPage && <Loader2 className='animate-spin' />}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default PostLikesDialog;
