'use client';

import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { FormField } from '@/components/container/FormField';
import { useUpdateProfileForm } from '@/components/pages/updateProfilePage/useUpdateProfileForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const UpdateProfilePage = () => {
  const {
    data,
    control,
    errors,
    preview,
    isPending,
    handleFileChange,
    handleSubmit,
    onSubmit,
  } = useUpdateProfileForm();

  if (!data) return null;

  const { profile } = data.data;

  return (
    <div className='text-neutral-25 mx-auto w-full max-w-208 px-4 py-20 md:py-32'>
      {/* Header */}
      <div className='mb-4 flex items-center gap-2 md:mb-8 md:gap-3'>
        <Link href='/myProfile'>
          <ArrowLeft className='size-6 md:size-8' />
        </Link>
        <h1 className='text-md md:text-display-xs font-bold'>Edit Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-8'
        encType='multipart/form-data'
      >
        {/* Avatar */}
        <div className='flex flex-col items-start gap-4 max-md:items-center md:flex-row md:justify-between md:gap-12'>
          <div className='flex flex-col items-center gap-4'>
            <Image
              src={preview || profile.avatarUrl || '/images/default-avatar.png'}
              alt='avatar'
              width={130}
              height={130}
              className='aspect-square size-20 rounded-full object-cover md:size-32.5'
            />
            <Label htmlFor='avatar' className='cursor-pointer'>
              <Button
                type='button'
                className='h-10 px-6 md:h-12'
                variant='secondary'
                asChild
              >
                <span>Change Photo</span>
              </Button>
              <Input
                id='avatar'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </Label>
            {errors.avatarUrl?.message && (
              <p className='text-accent-red text-sm'>
                {String(errors.avatarUrl.message)}
              </p>
            )}
          </div>

          <div className='flex-1 space-y-5'>
            <FormField
              id='name'
              label='Name'
              placeholder='Your name'
              control={control}
              name='name'
              error={errors.name?.message}
            />
            <FormField
              id='username'
              label='Username'
              placeholder='Your username'
              control={control}
              name='username'
              error={errors.username?.message}
            />
            <FormField
              id='phone'
              label='Phone'
              placeholder='Your phone'
              control={control}
              name='phone'
              error={errors.phone?.message}
            />

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='bio' className='text-sm font-bold'>
                Bio
              </Label>
              <Textarea
                id='bio'
                {...control.register('bio')}
                placeholder='Your bio'
                className={clsx(
                  'min-h-24 rounded-xl border border-neutral-900 bg-neutral-950 p-2',
                  errors.bio &&
                    'border-accent-red focus-visible:ring-accent-red'
                )}
              />
              {errors.bio && (
                <p className='text-accent-red text-sm'>{errors.bio.message}</p>
              )}
            </div>

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
