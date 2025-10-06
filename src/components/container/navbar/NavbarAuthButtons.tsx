'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const NavbarAuthButtons = () => (
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
);
