'use client';

import clsx from 'clsx';
import { ArrowUpToLine, CloudUpload, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useAddPostForm } from './useAddPostForm';

export const AddPostForm = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    handleImageChange,
    handleDeleteImage,
    handleChangeImage,
    errors,
    isPending,
    fileInputRef,
    preview,
  } = useAddPostForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Image Upload */}
      <div>
        <Label
          htmlFor='photo'
          className='mb-0.5 cursor-pointer text-sm font-bold'
        >
          Photo
        </Label>
        <Input
          ref={fileInputRef}
          id='photo'
          type='file'
          accept='image/jpeg, image/png, image/webp'
          onChange={handleImageChange}
          className='hidden'
        />

        {!preview ? (
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              'flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-neutral-950 transition-colors',
              errors.image
                ? 'border-accent-red focus-visible:ring-accent-red focus-visible:border-accent-red'
                : 'border-neutral-900'
            )}
          >
            <div className='mb-3 flex size-10 items-center justify-center rounded-md border border-neutral-900'>
              <CloudUpload className='text-neutral-25 size-5' />
            </div>
            <p className='mb-1 text-sm font-semibold text-neutral-600'>
              <span className='text-primary-200 font-bold'>
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className='text-sm font-semibold text-neutral-600'>
              PNG or JPG (max. 5mb)
            </p>
          </button>
        ) : (
          <div className='flex w-full flex-col items-center gap-3 rounded-xl border border-neutral-900 bg-neutral-950 p-4'>
            <Image
              src={preview}
              alt='Preview'
              width={300}
              height={300}
              className='max-h-[70vh] w-full object-contain'
            />
            <div className='flex w-full justify-center gap-3'>
              <Button variant='ghost' size='lg' onClick={handleChangeImage}>
                <ArrowUpToLine className='mr-1 size-5' /> Change
              </Button>
              <Button
                variant='ghost'
                size='lg'
                onClick={handleDeleteImage}
                className='text-accent-red'
              >
                <Trash2 className='mr-1 size-5' /> Delete
              </Button>
            </div>
          </div>
        )}

        {errors.image && (
          <p className='text-accent-red mt-1.5 text-sm'>
            {errors.image.message}
          </p>
        )}
      </div>

      {/* Caption */}
      <div>
        <Label
          htmlFor='caption'
          className='mb-0.5 cursor-pointer text-sm font-bold'
        >
          Caption
        </Label>
        <Textarea
          {...register('caption')}
          placeholder='Create your caption...'
          id='caption'
          className={clsx(
            'min-h-25 w-full rounded-xl border bg-neutral-950 p-2 text-sm',
            errors.caption
              ? 'border-accent-red focus-visible:ring-accent-red focus-visible:border-accent-red'
              : 'border-neutral-900'
          )}
        />
        {errors.caption && (
          <p className='text-accent-red mt-1.5 text-sm'>
            {errors.caption.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type='submit'
        disabled={isPending}
        className='h-10 w-full md:h-12'
      >
        {isPending ? 'Sharing...' : 'Share'}
      </Button>
    </form>
  );
};
