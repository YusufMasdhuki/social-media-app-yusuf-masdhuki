'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/container/FormField';
import { Button } from '@/components/ui/button';

import { useLogin } from '@/hooks/auth/useLogin';
import { LoginSchema, loginSchema } from '@/schemas/login-schema';

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data); // panggil useLogin
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center py-30'>
      <div className='z-5 flex w-full max-w-[523px] flex-col items-center justify-center rounded-2xl border border-neutral-900 bg-black/20 px-6 py-10 backdrop-blur'>
        {/* Logo */}
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

        <p className='text-display-xs mb-6 text-center font-bold'>
          Welcome Back!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-5'
        >
          <FormField
            id='email'
            label='Email'
            placeholder='Enter your email'
            control={control}
            name='email'
            error={errors.email?.message}
          />
          <FormField
            id='password'
            label='Password'
            placeholder='Enter your password'
            isPassword
            control={control}
            name='password'
            error={errors.password?.message}
          />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <p className='text-md mt-4 font-semibold'>
          Don&apos;t have an account?
          <Link href='/register' className='text-primary-200 font-bold'>
            {' '}
            Register
          </Link>
        </p>
      </div>

      {/* Background */}
      <div className='absolute right-0 bottom-0 left-0 w-full'>
        <Image
          src='/images/auth-gradient.png'
          alt='auth gradient'
          width={1440}
          height={984}
          className='h-auto w-full object-cover object-bottom'
        />
      </div>
    </div>
  );
};

export default LoginPage;
