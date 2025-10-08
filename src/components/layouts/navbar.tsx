'use client';

import clsx from 'clsx';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

import { useGetMe } from '@/hooks/my-profile/useGetMe';

import { NavbarAuthButtons } from '../container/navbar/NavbarAuthButtons';
import { NavbarLogo } from '../container/navbar/NavbarLogo';
import { NavbarSearch } from '../container/navbar/NavbarSearch';
import { NavbarUserMenu } from '../container/navbar/NavbarUserMenu';
import { useHideOnScroll } from '../container/navbar/useHideOnScroll';

export const Navbar = () => {
  const { data: me, isLoading } = useGetMe();
  const hidden = useHideOnScroll();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div
      className={clsx(
        'fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-center border-b border-neutral-900 bg-black transition-transform duration-300 md:h-20',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className='flex w-full max-w-300 items-center justify-between gap-4 px-4'>
        {/* jika mobileSearchOpen = false, tampil layout normal */}
        {!mobileSearchOpen ? (
          <>
            {/* kiri */}
            <NavbarLogo />

            {/* tengah (search bar hanya di desktop) */}
            <div className='hidden w-full max-w-80 pl-8 md:block lg:max-w-125'>
              <NavbarSearch />
            </div>

            {/* kanan */}
            <div className='flex items-center gap-4'>
              {/* tombol search mobile */}
              <button
                className='md:hidden'
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className='text-neutral-25 size-6' />
              </button>

              {isLoading ? (
                <span className='text-sm text-neutral-500'>Loading...</span>
              ) : me?.success ? (
                <NavbarUserMenu
                  name={me.data.profile.name}
                  avatarUrl={
                    me.data.profile.avatarUrl || '/images/default-avatar.png'
                  }
                />
              ) : (
                <NavbarAuthButtons />
              )}
            </div>
          </>
        ) : (
          // jika mobileSearchOpen = true → tampilan logo + search + tombol X
          <div className='flex w-full items-center gap-4'>
            <NavbarLogo />
            <div className='flex-1'>
              <NavbarSearch />
            </div>
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className='size-6 text-neutral-700' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
