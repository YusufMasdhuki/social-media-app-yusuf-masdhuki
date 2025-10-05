'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useGetPostById } from '@/hooks/posts/useGetPostById';

import { PostCommentsSection } from './PostCommentsSection';
import { PostImageSection } from './PostImageSection';

interface PostCommentsDialogProps {
  postId: number;
  trigger?: React.ReactNode; // sekarang optional
  onClose?: () => void; // tambahkan onClose opsional
}

export function PostCommentsDialog({
  postId,
  trigger,
  onClose,
}: PostCommentsDialogProps) {
  const { data: postData, isLoading, isError, error } = useGetPostById(postId);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onClose?.(); // panggil onClose saat dialog ditutup
      }}
      open={!!trigger ? undefined : true} // jika trigger tidak ada, dialog otomatis terbuka
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className='top-[50%] h-[90vh] w-full max-w-[1184px] gap-0 border-none !bg-transparent px-4 pt-10 pb-0'>
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
            {error?.message || 'Failed to load post'}
          </p>
        )}

        {postData && (
          <div className='flex h-[calc(90vh-40px)] max-w-[1184px] overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950'>
            <PostImageSection imageUrl={postData.data.imageUrl} />
            <PostCommentsSection post={postData.data} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
