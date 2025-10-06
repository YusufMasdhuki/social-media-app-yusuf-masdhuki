'use client';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { AppDispatch } from '@/store';
import { logout } from '@/store/slices/auth-slice';

interface Props {
  name: string;
  avatarUrl?: string;
}

export const NavbarUserMenu = ({ name, avatarUrl }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    queryClient.setQueryData(['me'], null);
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='text'
          className='flex items-center gap-3 px-0 outline-none'
        >
          <Image
            src={avatarUrl || '/images/default-avatar.png'}
            alt='avatar'
            width={48}
            height={48}
            className='aspect-square size-12 rounded-full object-cover'
          />
          <span className='text-md font-bold'>{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-40 border-neutral-900 bg-neutral-950 text-white'
      >
        <DropdownMenuItem onClick={() => router.push('/myProfile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
