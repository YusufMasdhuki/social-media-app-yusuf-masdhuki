'use client';

import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ ambil path sekarang
import React, { useEffect, useState } from 'react';

import HomeIcon from '../icons/home-icon';
import ProfileIcon from '../icons/profile-icon';

const BottomNavbar = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname(); // ✅ detect halaman aktif

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setHidden(true); // scroll down
      } else {
        setHidden(false); // scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={clsx(
        'pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center px-6 pb-4 transition-transform duration-300 md:pb-8',
        hidden ? 'translate-y-full' : 'translate-y-0'
      )}
    >
      <div className='pointer-events-auto flex h-16 w-full max-w-90 items-center justify-between rounded-full border border-neutral-900 bg-neutral-950 px-4 md:h-20'>
        {/* Home */}
        <Link
          href='/'
          className='group flex w-23.5 flex-col items-center gap-0.5 md:gap-1'
        >
          <HomeIcon
            className={clsx(
              'size-5 transition-all duration-300 ease-out md:size-6',
              pathname === '/'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          />
          <p
            className={clsx(
              'md:text-md text-xs transition-all duration-300 ease-out',
              pathname === '/'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          >
            Home
          </p>
        </Link>

        {/* Add Post */}
        <Link
          href='/addPost'
          className='bg-primary-300 hover:bg-primary-400 flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors md:size-12'
        >
          <Plus className='size-5.5 text-white md:size-6' />
        </Link>

        {/* Profile */}
        <Link
          href='/myProfile'
          className='group flex w-23.5 flex-col items-center gap-0.5 md:gap-1'
        >
          <ProfileIcon
            className={clsx(
              'size-5 transition-all duration-300 ease-out md:size-6',
              pathname === '/myProfile'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          />
          <p
            className={clsx(
              'md:text-md text-xs transition-all duration-300 ease-out',
              pathname === '/myProfile'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          >
            Profile
          </p>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
