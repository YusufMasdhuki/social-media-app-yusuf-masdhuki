'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface MyProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl: string | null;
}

export const MyProfileHeader = ({
  name,
  username,
  avatarUrl,
}: MyProfileHeaderProps) => {
  const router = useRouter();

  return (
    <div className='flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between'>
      <div className='flex items-center gap-3 md:gap-5'>
        <Image
          src={avatarUrl || '/images/default-avatar.png'}
          alt={username}
          width={64}
          height={64}
          className='aspect-square rounded-full object-cover'
        />
        <div>
          <h1 className='md:text-md text-sm font-bold'>{name}</h1>
          <p className='md:text-md text-sm'>{username}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <Button
          variant='secondary'
          onClick={() => router.push('/updateProfile')}
          className='h-10 px-5.5 max-md:w-full md:h-12'
        >
          Edit Profile
        </Button>
        <Button
          className='size-10 rounded-full md:size-12'
          size='icon'
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
};
