'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreatePost } from '@/hooks/posts/useCreatePost';
import { errorToast } from '@/lib/toast-helper';
import {
  createPostSchema,
  type CreatePostSchema,
} from '@/schemas/createPostSchema';

export const useAddPostForm = () => {
  const { mutate: createPost, isPending } = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    setError,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  });

  useEffect(() => {
    register('image', { required: true });
  }, [register]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('image', { message: 'Maximum image size 5MB' });
      errorToast('Maximum image size 5MB');
      e.target.value = '';
      return;
    }

    if (
      !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
        file.type
      )
    ) {
      setError('image', { message: 'Format must be JPG, JPEG, PNG, or WEBP' });
      errorToast('Format must be JPG, JPEG, PNG, or WEBP');
      e.target.value = '';
      return;
    }

    setError('image', { message: '' });
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
      errorToast('Invalid file');
      return;
    }

    createPost({
      image: data.image,
      caption: data.caption,
    });
  };

  return {
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
  };
};
