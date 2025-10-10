'use client';

import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ConfirmUnfollowDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
}

export function ConfirmUnfollowDialog({
  open,
  onClose,
  onConfirm,
  username,
}: ConfirmUnfollowDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='top-1/2 left-1/2 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 border-none bg-transparent pt-7'>
        <AnimatePresence mode='wait'>
          <motion.div
            key='return-dialog'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='rounded-2xl border border-neutral-900 bg-neutral-950 p-4 shadow-xl md:p-6'
          >
            <DialogHeader className='mb-4'>
              <DialogTitle>
                Unfollow{' '}
                <span className='text-primary-200 font-semibold'>
                  @{username}
                </span>
                ?
              </DialogTitle>
            </DialogHeader>
            <p className='text-neutral-25 text-sm'>
              Are you sure you want to unfollow{' '}
              <span className='text-primary-200 font-semibold'>
                @{username}
              </span>
              ? You won&apos;t see their posts in your feed anymore.
            </p>
            <DialogFooter className='mt-4'>
              <Button
                variant='secondary'
                className='!h-10 px-4'
                onClick={onClose}
              >
                Batal
              </Button>
              <Button className='!h-10 px-4' onClick={onConfirm}>
                Unfollow
              </Button>
            </DialogFooter>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
