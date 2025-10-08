'use client';

import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { useIsMobile } from '@/lib/use-is-mobile';

export const NavbarAuthButtons = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile)
    return (
      <div>
        <Button size='icon' variant='icon' onClick={() => setOpen(!open)}>
          {open ? <X className='size-6' /> : <Menu className='size-6' />}
        </Button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='fixed top-15.5 left-0 z-40 flex w-full gap-4 border-b border-neutral-900 bg-black p-3 shadow-md md:hidden'
            >
              <Link
                href='/login'
                className='flex-1'
                onClick={() => setOpen(false)}
              >
                <Button variant='secondary' className='w-full'>
                  Login
                </Button>
              </Link>
              <Link
                href='/register'
                className='flex-1'
                onClick={() => setOpen(false)}
              >
                <Button className='w-full'>Register</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

  return (
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
};
