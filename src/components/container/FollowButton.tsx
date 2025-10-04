'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmUnfollowDialog } from '@/components/container/ConfirmUnfollowDialog';
import { Button } from '@/components/ui/button';

import { useToggleFollowUser } from '@/hooks/follow/useToggleFollowUser';

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
}

export function FollowButton({ username, isFollowing }: FollowButtonProps) {
  const { mutate, isPending } = useToggleFollowUser(username);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (isFollowing) {
      // tampilkan konfirmasi untuk unfollow
      setOpen(true);
    } else {
      // langsung follow
      mutate({ follow: true });
    }
  };

  const handleConfirmUnfollow = () => {
    mutate({ follow: false });
    setOpen(false);
  };

  return (
    <>
      <Button
        disabled={isPending}
        variant={isFollowing ? 'secondary' : 'default'}
        onClick={handleClick}
        className='!h-10 px-6'
      >
        {isPending ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </Button>

      <ConfirmUnfollowDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmUnfollow}
        username={username}
      />
    </>
  );
}
