'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface Props {
  user: {
    name: string;
    username: string;
    avatarUrl?: string | null;
    isFollowing: boolean;
  };
  isPending: boolean;
  onFollowClick: () => void;
}

export const ProfileHeader = ({ user, isPending, onFollowClick }: Props) => (
  <div className='flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between'>
    <div className='flex items-center gap-3 md:gap-5'>
      <Image
        src={user.avatarUrl || '/images/default-avatar.png'}
        alt={user.username}
        width={64}
        height={64}
        className='aspect-square rounded-full object-cover'
      />
      <div>
        <h1 className='md:text-md text-sm font-bold'>{user.name}</h1>
        <p className='md:text-md text-sm'>{user.username}</p>
      </div>
    </div>

    <div className='flex items-center gap-3'>
      <Button
        variant={user.isFollowing ? 'secondary' : 'default'}
        className='h-10 gap-2 px-5.5 max-md:w-full md:h-12'
        disabled={isPending}
        onClick={onFollowClick}
      >
        {isPending ? (
          'Processing...'
        ) : user.isFollowing ? (
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

      <Button
        size='icon'
        className='size-10 rounded-full md:size-12'
        variant='secondary'
      >
        <Image
          src='/icons/share-icon.svg'
          alt='share'
          width={24}
          height={24}
          className='size-5 md:size-6'
        />
      </Button>
    </div>
  </div>
);
