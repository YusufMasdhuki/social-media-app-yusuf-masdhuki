'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/container/FormField';
import { Button } from '@/components/ui/button';

import { useGetMe, useUpdateMe } from '@/hooks/my-profile/useGetMe';
import {
  UpdateProfileFormValues,
  updateProfileSchema,
} from '@/schemas/updateProfileSchema';

const UpdateProfile = () => {
  const { data } = useGetMe();
  const { mutate: updateProfile, isPending } = useUpdateMe();

  const [preview, setPreview] = useState<string | null>(null);

  // ✅ 3. Setup form react-hook-form + zod
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: data?.data.profile.name ?? '',
      username: data?.data.profile.username ?? '',
      phone: data?.data.profile.phone ?? '',
      bio: data?.data.profile.bio ?? '',
      avatarUrl: null,
    },
  });

  // ✅ 4. Handle submit
  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfile({
      name: values.name,
      username: values.username,
      phone: values.phone || undefined,
      bio: values.bio ?? null,
      avatarUrl: values.avatarUrl instanceof File ? values.avatarUrl : null,
    });
  };

  // ✅ 5. Handle change photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatarUrl', file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  if (!data) return null;

  const { profile } = data.data;

  return (
    <div className='mx-auto w-full max-w-208 px-4 py-32'>
      {/* Header */}
      <div className='mb-8 flex items-center gap-3'>
        <Link href='/myProfile'>
          <ArrowLeft className='size-8' />
        </Link>
        <h1 className='text-display-xs font-bold'>Edit Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-8'
        encType='multipart/form-data'
      >
        {/* Avatar */}
        <div className='flex items-center justify-between gap-12'>
          <div className='flex flex-col items-center gap-4'>
            <Image
              src={preview || profile.avatarUrl || '/images/default-avatar.png'}
              alt='avatar'
              width={130}
              height={130}
              className='aspect-square size-32.5 rounded-full object-cover'
            />
            <label htmlFor='avatar' className='cursor-pointer'>
              <Button
                type='button'
                className='px-6'
                variant='secondary'
                asChild
              >
                <span>Change Photo</span>
              </Button>
              <input
                id='avatar'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
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
            <FormField
              id='bio'
              label='Bio'
              placeholder='Your bio'
              control={control}
              name='bio'
              error={errors.bio?.message}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={isPending}
            className='text-md px-10 py-3 font-semibold'
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
