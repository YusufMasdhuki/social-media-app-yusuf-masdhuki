'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const NavbarLogo = () => (
  <Link href='/' className='flex items-center gap-3'>
    <Image
      src='/icons/logo-sociality-white.svg'
      alt='logo sociality'
      width={30}
      height={30}
      className='size-7.5'
    />
    <h1 className='text-display-xs font-bold md:inline'>Sociality</h1>
  </Link>
);
