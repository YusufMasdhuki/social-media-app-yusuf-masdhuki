import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center py-30'>
      <div className='z-5 flex w-full max-w-[523px] flex-col items-center justify-center rounded-2xl border border-neutral-900 bg-black/20 px-6 py-10 backdrop-blur'>
        <div className='mx-auto mb-6 flex items-center gap-3'>
          <Image
            src='/icons/logo-sociality-white.svg'
            alt='logo sociality'
            width={30}
            height={30}
            className='size-7.5'
          />
          <h1 className='text-display-xs text-center font-bold'>Sociality</h1>
        </div>
        <p className='text-display-xs mb-6 text-center font-bold'>Register</p>
        <form action='' className='flex w-full flex-col gap-5'>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='name' className='text-sm'>
              Name
            </Label>
            <Input
              id='name'
              type='text'
              placeholder='Enter your name'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='username' className='text-sm'>
              Username
            </Label>
            <Input
              id='username'
              type='text'
              placeholder='Enter your username'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='email' className='text-sm'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='number-phone' className='text-sm'>
              Number Phone
            </Label>
            <Input
              id='number-phone'
              type='tel'
              placeholder='Enter your number phone'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='password' className='text-sm'>
              Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Label htmlFor='confirm-password' className='text-sm'>
              Confirm Password
            </Label>
            <Input
              id='confirm-password'
              type='password'
              placeholder='Enter your confirm password'
              className='h-12 rounded-xl border-neutral-900'
            />
          </div>
          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
        <p className='text-md mt-4 font-semibold'>
          Already have an account?
          <span className='text-primary-200 font-bold'> Login</span>
        </p>
      </div>

      <div className='absolute right-0 bottom-0 left-0 w-full'>
        <Image
          src='/images/auth-gradient.png'
          alt='auth gradient'
          width={1440} // kasih dimensi asli gambar biar aspect ratio terjaga
          height={984}
          className='h-auto w-full object-cover object-bottom'
        />
      </div>
    </div>
  );
};

export default RegisterPage;
