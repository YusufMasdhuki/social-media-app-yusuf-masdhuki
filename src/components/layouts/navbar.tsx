'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useGetMe } from '@/hooks/my-profile/useGetMe';
import type { AppDispatch } from '@/store';
import { logout } from '@/store/slices/auth-slice';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Navbar = () => {
  const { data: me, isLoading } = useGetMe();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    queryClient.setQueryData(['me'], null);
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  // 🔹 State buat show/hide navbar
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        // Scroll down → hide
        setHidden(true);
      } else {
        // Scroll up → show
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={clsx(
        'fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-center border-b border-neutral-900 bg-black transition-transform duration-300 md:h-20',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className='flex w-full max-w-300 items-center justify-between gap-4 px-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-3'>
          <Image
            src='/icons/logo-sociality-white.svg'
            alt='logo sociality'
            width={30}
            height={30}
            className='size-7.5'
          />
          <h1 className='text-display-xs font-bold'>Sociality</h1>
        </Link>

        {/* Search */}
        <div className='relative w-full md:max-w-125'>
          <Search className='absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500' />
          <Input
            placeholder='Search'
            className='md:text-md h-11 w-full rounded-full border border-neutral-900 bg-neutral-950 pl-10.5 text-sm md:h-12'
          />
        </div>

        {/* Right side */}
        <div className='flex items-center justify-end gap-3'>
          {isLoading ? (
            <span className='text-sm text-neutral-400'>Loading...</span>
          ) : me?.success ? (
            // === Setelah login: auto width ===
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='text'
                  className='flex items-center gap-3 px-0 outline-none'
                >
                  <Image
                    src={
                      me.data.profile.avatarUrl || '/images/default-avatar.png'
                    }
                    alt='avatar'
                    width={48}
                    height={48}
                    className='aspect-square size-12 rounded-full object-cover'
                  />
                  <span className='text-md font-bold'>
                    {me.data.profile.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-40 border-neutral-900 bg-neutral-950 text-white'
              >
                <DropdownMenuItem onClick={() => router.push('/myProfile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // === Belum login: tombol fixed width ===
            <div className='flex gap-3'>
              <Link href='/login' passHref>
                <Button asChild variant='secondary' className='h-11 w-[130px]'>
                  <span>Login</span>
                </Button>
              </Link>
              <Link href='/register' passHref>
                <Button asChild className='h-11 w-[130px]'>
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
