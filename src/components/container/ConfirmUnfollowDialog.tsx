'use client';

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
      <DialogContent className='border border-neutral-900 bg-neutral-950 sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Unfollow @{username}?</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>
          Kamu yakin ingin berhenti mengikuti @{username}? Kamu tidak akan
          melihat postingannya lagi di feed.
        </p>
        <DialogFooter className='mt-4'>
          <Button variant='secondary' className='!h-10 px-4' onClick={onClose}>
            Batal
          </Button>
          <Button className='!h-10 px-4' onClick={onConfirm}>
            Unfollow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
