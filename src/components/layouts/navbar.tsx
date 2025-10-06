'use client';

import clsx from 'clsx';

import { useGetMe } from '@/hooks/my-profile/useGetMe';

import { NavbarAuthButtons } from '../container/navbar/NavbarAuthButtons';
import { NavbarLogo } from '../container/navbar/NavbarLogo';
import { NavbarSearch } from '../container/navbar/NavbarSearch';
import { NavbarUserMenu } from '../container/navbar/NavbarUserMenu';
import { useHideOnScroll } from '../container/navbar/useHideOnScroll';

export const Navbar = () => {
  const { data: me, isLoading } = useGetMe();
  const hidden = useHideOnScroll();

  return (
    <div
      className={clsx(
        'fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-center border-b border-neutral-900 bg-black transition-transform duration-300 md:h-20',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className='flex w-full max-w-300 items-center justify-between gap-4 px-4'>
        <NavbarLogo />
        <NavbarSearch />

        <div className='flex items-center justify-end gap-3'>
          {isLoading ? (
            <span className='text-sm text-neutral-400'>Loading...</span>
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
      </div>
    </div>
  );
};

export default Navbar;
