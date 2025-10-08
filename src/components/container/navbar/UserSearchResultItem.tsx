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
        'flex w-full cursor-pointer items-center gap-2 text-left transition-colors hover:bg-neutral-900'
      )}
    >
      <Image
        src={avatarSrc}
        alt={user.name}
        width={48}
        height={48}
        className='size-12 rounded-full object-cover'
      />
      <div className='flex flex-col'>
        <span className='text-neutral-25 text-sm font-bold'>{user.name}</span>
        <span className='text-sm text-neutral-400'>{user.username}</span>
      </div>
    </button>
  );
};
