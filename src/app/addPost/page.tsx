'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreatePost } from '@/hooks/posts/useCreatePost';
import {
  createPostSchema,
  type CreatePostSchema,
} from '@/schemas/createPostSchema';

const AddPostPage = () => {
  const { mutate: createPost, isPending } = useCreatePost();

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Register manual field image
  useEffect(() => {
    register('image', { required: true });
  }, [register]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Validasi ukuran maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB');
      e.target.value = '';
      return;
    }

    setValue('image', file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));

    e.target.value = '';
  };

  const handleDeleteImage = () => {
    resetField('image');
    setPreview(null);
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: CreatePostSchema) => {
    if (!(data.image instanceof File)) {
      alert('File tidak valid');
      return;
    }

    createPost({
      image: data.image,
      caption: data.caption,
    });
  };

  return (
    <div className='mx-auto min-h-screen max-w-[460px] px-4 py-32'>
      <h1 className='mb-4 text-xl font-semibold'>Add New Post</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 rounded-lg border p-4'
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg, image/png, image/webp'
          onChange={handleImageChange}
          className='hidden'
        />

        {/* Upload */}
        {!preview ? (
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='block h-40 w-full rounded-lg border border-dashed text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-500'
          >
            + Upload Image
          </button>
        ) : (
          <div className='flex w-full flex-col items-center gap-3'>
            <Image
              src={preview}
              alt='Preview'
              width={300}
              height={300}
              className='w-full rounded-lg border object-contain'
            />
            <div className='flex w-full gap-2'>
              <button
                type='button'
                onClick={handleChangeImage}
                className='flex-1 rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600'
              >
                Change Image
              </button>
              <button
                type='button'
                onClick={handleDeleteImage}
                className='flex-1 rounded bg-red-500 py-2 text-white hover:bg-red-600'
              >
                Delete Image
              </button>
            </div>
          </div>
        )}

        <div>
          <textarea
            {...register('caption')}
            placeholder='Tulis caption...'
            className='w-full rounded border p-2'
          />
          {errors.caption && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.caption.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60'
        >
          {isPending ? 'Mengupload...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;
