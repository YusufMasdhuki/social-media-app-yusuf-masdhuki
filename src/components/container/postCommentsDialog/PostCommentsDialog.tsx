'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { FeedItem } from '@/types/feed-type';

import { PostCommentsSection } from './PostCommentsSection';
import { PostImageSection } from './PostImageSection';

interface PostCommentsDialogProps {
  post?: FeedItem; // 👈 langsung pakai data feed
  trigger?: React.ReactNode;
  onClose?: () => void;
  username?: string;
  userPostsLimit?: number;
}

export function PostCommentsDialog({
  post,
  trigger,
  onClose,
  username,
  userPostsLimit,
}: PostCommentsDialogProps) {
  if (!post) return null; // safety guard

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
      open={!!trigger ? undefined : true}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className='pointer-events-none top-[50%] h-[90vh] w-full max-w-[1184px] gap-0 border-none !bg-transparent px-4 pt-10 pb-0'>
        <VisuallyHidden>
          <DialogTitle>Comments</DialogTitle>
        </VisuallyHidden>

        <div className='pointer-events-auto flex h-[calc(90vh-40px)] max-w-[1184px] overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950'>
          <PostImageSection imageUrl={post.imageUrl} />
          <PostCommentsSection
            post={post}
            username={username}
            userPostsLimit={userPostsLimit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
