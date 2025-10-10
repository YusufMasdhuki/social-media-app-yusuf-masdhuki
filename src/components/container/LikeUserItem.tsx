import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { useToggleFollowUser } from '@/hooks/follow/useToggleFollowUser';
import { useProfileNavigation } from '@/lib/useProfileNavigation';
import { UserLike } from '@/types/get-post-likes-type';

import { ConfirmUnfollowDialog } from './ConfirmUnfollowDialog';
import { Button } from '../ui/button';

function LikeUserItem({ user }: { user: UserLike }) {
  const { mutate, isPending } = useToggleFollowUser(user.username);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { handleProfileClick } = useProfileNavigation();

  const handleClick = () => {
    if (user.isFollowedByMe) {
      setConfirmOpen(true);
    } else {
      mutate({ follow: true });
    }
  };

  const handleUnfollowConfirm = () => {
    mutate({ follow: false });
    setConfirmOpen(false);
  };

  return (
    <li className='flex w-full items-center justify-between gap-2'>
      <div
        className='group transition-bases flex cursor-pointer items-center gap-2'
        onClick={() => handleProfileClick(user.username)}
      >
        <Image
          src={user.avatarUrl || '/images/default-avatar.png'}
          width={48}
          height={48}
          alt={user.username}
          className='aspect-square rounded-full object-cover'
        />
        <div>
          <p className='group-hover:text-primary-200 transition-base line-clamp-1 text-sm font-bold'>
            {user.name}
          </p>
          <p className='line-clamp-1 text-sm text-neutral-400'>
            {user.username}
          </p>
        </div>
      </div>

      {!user.isMe && (
        <Button
          disabled={isPending}
          variant={user.isFollowedByMe ? 'secondary' : 'default'}
          className={clsx(
            'flex !h-10 items-center gap-2 transition-all duration-200',
            user.isFollowedByMe ? 'px-4' : 'px-6'
          )}
          onClick={handleClick}
        >
          {isPending ? (
            <Loader2 className='size-5 animate-spin' />
          ) : user.isFollowedByMe ? (
            <>
              <Image
                src='/icons/checkbox-icon.svg'
                alt='Following'
                width={20}
                height={20}
                className='opacity-80'
              />
              <span>Following</span>
            </>
          ) : (
            'Follow'
          )}
        </Button>
      )}

      {confirmOpen && (
        <ConfirmUnfollowDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleUnfollowConfirm}
          username={user.username}
        />
      )}
    </li>
  );
}

export default LikeUserItem;
