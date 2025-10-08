'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/container/FormField';
import { Button } from '@/components/ui/button';

import { useRegister } from '@/hooks/auth/useRegister';
import { RegisterFormValues, registerSchema } from '@/schemas/register-schema';
import type { RegisterRequest } from '@/types/auth-type';

const RegisterPage = () => {
  const {
    control, // ✅ ambil control
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useRegister();

  const onSubmit = (values: RegisterFormValues) => {
    const payload: RegisterRequest = {
      name: values.name,
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };
    mutate(payload);
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center px-4 py-4 md:py-30'>
      <div className='z-5 flex w-full max-w-[523px] flex-col items-center justify-center rounded-2xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur md:px-6 md:py-10'>
        {/* Logo */}
        <div className='mx-auto mb-4 flex items-center gap-3 md:mb-6'>
          <Image
            src='/icons/logo-sociality-white.svg'
            alt='logo sociality'
            width={30}
            height={30}
            className='size-7.5'
          />
          <h1 className='text-display-xs text-center font-bold'>Sociality</h1>
        </div>

        <p className='md:text-display-xs mb-4 text-center text-xl font-bold md:mb-6'>
          Register
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-5'
        >
          <FormField<RegisterFormValues>
            id='name'
            name='name'
            control={control}
            label='Name'
            placeholder='Enter your name'
            error={errors.name?.message}
          />
          <FormField<RegisterFormValues>
            id='username'
            name='username'
            control={control}
            label='Username'
            placeholder='Enter your username'
            error={errors.username?.message}
          />
          <FormField<RegisterFormValues>
            id='email'
            name='email'
            control={control}
            type='email'
            label='Email'
            placeholder='Enter your email'
            error={errors.email?.message}
          />
          <FormField<RegisterFormValues>
            id='phone'
            name='phone'
            control={control}
            type='tel'
            label='Phone Number'
            placeholder='Enter your phone number'
            error={errors.phone?.message}
          />
          <FormField<RegisterFormValues>
            id='password'
            name='password'
            control={control}
            label='Password'
            placeholder='Enter your password'
            error={errors.password?.message}
            isPassword
          />
          <FormField<RegisterFormValues>
            id='confirmPassword'
            name='confirmPassword'
            control={control}
            label='Confirm Password'
            placeholder='Confirm your password'
            error={errors.confirmPassword?.message}
            isPassword
          />

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>

        <p className='md:text-md mt-4 text-sm font-semibold'>
          Already have an account?
          <Link href='/login' className='text-primary-200 font-bold'>
            {' '}
            Login
          </Link>
        </p>
      </div>

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

export default RegisterPage;
