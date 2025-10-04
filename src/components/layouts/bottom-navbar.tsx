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
        'fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center pb-8 transition-transform duration-300',
        hidden ? 'translate-y-full' : 'translate-y-0'
      )}
    >
      <div className='flex h-20 w-90 items-center justify-between rounded-full border border-neutral-900 bg-neutral-950 px-4'>
        {/* Home */}
        <Link
          href='/'
          className='group flex w-23.5 flex-col items-center gap-1'
        >
          <HomeIcon
            className={clsx(
              'size-6 transition-all duration-300 ease-out',
              pathname === '/'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          />
          <p
            className={clsx(
              'text-md transition-all duration-300 ease-out',
              pathname === '/'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          >
            Home
          </p>
        </Link>

        {/* Add Post */}
        <div className='bg-primary-300 flex size-12 cursor-pointer items-center justify-center rounded-full'>
          <Plus className='size-6 text-white' />
        </div>

        {/* Profile */}
        <Link
          href='/myProfile'
          className='group flex w-23.5 flex-col items-center gap-1'
        >
          <ProfileIcon
            className={clsx(
              'size-6 transition-all duration-300 ease-out',
              pathname === '/myProfile'
                ? 'text-primary-200'
                : 'group-hover:text-primary-100 text-white'
            )}
          />
          <p
            className={clsx(
              'text-md transition-all duration-300 ease-out',
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
