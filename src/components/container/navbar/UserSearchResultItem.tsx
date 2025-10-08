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

  // Pastikan avatarSrc valid untuk Next.js Image
  const avatarSrc = user.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl // URL remote
      : user.avatarUrl.startsWith('/')
        ? user.avatarUrl // relative path sudah valid
        : `/${user.avatarUrl}` // tambahkan slash jika kurang
    : '/images/default-avatar.png'; // fallback lokal

  return (
    <button
      onClick={() => {
        onClick?.(); // ✅ tutup dropdown jika ada
        setTimeout(() => {
          router.push(`/friendsProfile/${user.username}`);
        }, 50);
      }}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-900'
      )}
    >
      <Image
        src={avatarSrc}
        alt={user.name}
        width={40}
        height={40}
        className='h-10 w-10 rounded-full object-cover'
      />
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-white'>{user.name}</span>
        <span className='text-xs text-neutral-400'>@{user.username}</span>
      </div>
    </button>
  );
};
