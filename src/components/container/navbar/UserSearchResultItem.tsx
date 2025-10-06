'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { UserSearchResult } from '@/types/user-search-type';

interface Props {
  user: UserSearchResult;
  onClick?: () => void;
}

export const UserSearchResultItem = ({ user, onClick }: Props) => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        onClick?.(); // ✅ tutup dropdown
        setTimeout(() => {
          router.push(`/friendsProfile/${user.username}`);
        }, 50);
      }}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-900'
      )}
    >
      <Image
        src={user.avatarUrl || '/images/default-avatar.png'}
        alt={user.name}
        width={40}
        height={40}
        className='size-10 rounded-full object-cover'
      />
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-white'>{user.name}</span>
        <span className='text-xs text-neutral-400'>@{user.username}</span>
      </div>
    </button>
  );
};
