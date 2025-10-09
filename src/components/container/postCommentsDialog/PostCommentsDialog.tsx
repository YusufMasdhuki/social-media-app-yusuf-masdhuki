import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'motion/react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useSavedPosts } from '@/hooks/saves/useSavedPosts';
import { useIsMobile } from '@/lib/use-is-mobile';
import type { FeedItem } from '@/types/feed-type';

import { PostCommentsSection } from './PostCommentsSection';
import { PostImageSection } from './PostImageSection';

interface PostCommentsDialogProps {
  post?: FeedItem;
  trigger?: React.ReactNode;
  onClose?: () => void;
  username?: string;
  userPostsLimit?: number;
  onLikeChange?: (postId: number, liked: boolean, likeCount: number) => void;
  onSaveChange?: (postId: number, saved: boolean) => void;
}

export function PostCommentsDialog({
  post,
  trigger,
  onClose,
  username,
  userPostsLimit,
  onLikeChange,
  onSaveChange,
}: PostCommentsDialogProps) {
  const { toggle } = useSavedPosts();
  const isMobile = useIsMobile();
  if (!post) return null;

  return (
    <Dialog
      onOpenChange={(open) => !open && onClose?.()}
      open={!!trigger ? undefined : true}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className='pointer-events-none right-0 left-0 w-full max-w-[1184px] gap-0 border-none !bg-transparent px-0 pt-10 pb-0 max-md:bottom-0 md:px-4'>
        <VisuallyHidden>
          <DialogTitle>Comments</DialogTitle>
        </VisuallyHidden>

        <AnimatePresence mode='wait'>
          <motion.div
            key='comments-modal'
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className='pointer-events-auto flex h-[calc(80vh-40px)] max-w-[1184px] overflow-hidden rounded-2xl border border-neutral-900 max-md:bottom-0 md:h-[calc(90vh-40px)]'
          >
            {!isMobile && <PostImageSection imageUrl={post.imageUrl} />}

            <PostCommentsSection
              post={post}
              username={username}
              userPostsLimit={userPostsLimit}
              onLikeChange={onLikeChange}
              onSaveChange={(postId, saved) => {
                toggle(postId); // update Redux
                onSaveChange?.(postId, saved); // sinkron ke state lokal parent
              }}
            />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
