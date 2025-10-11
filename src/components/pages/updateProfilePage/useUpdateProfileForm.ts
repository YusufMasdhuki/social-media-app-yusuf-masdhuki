'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useGetMe, useUpdateMe } from '@/hooks/my-profile/useGetMe';
import { errorToast } from '@/lib/toast-helper';
import {
  UpdateProfileFormValues,
  updateProfileSchema,
} from '@/schemas/updateProfileSchema';

export const useUpdateProfileForm = () => {
  const { data } = useGetMe();
  const { mutate: updateProfile, isPending } = useUpdateMe();

  const [preview, setPreview] = useState<string | null>(null);

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

  useEffect(() => {
    if (data?.data.profile) {
      const { name, username, phone, bio } = data.data.profile;
      setValue('name', name ?? '');
      setValue('username', username ?? '');
      setValue('phone', phone ?? '');
      setValue('bio', bio ?? '');
    }
  }, [data, setValue]);

  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfile({
      name: values.name,
      username: values.username,
      phone: values.phone || undefined,
      bio: values.bio ?? null,
      avatarUrl: values.avatarUrl instanceof File ? values.avatarUrl : null,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ validasi manual sebelum masuk ke form
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      errorToast('Hanya file JPG, PNG, atau WEBP yang diperbolehkan.');
      return;
    }

    if (file.size > maxSize) {
      errorToast('Ukuran gambar tidak boleh lebih dari 5MB.');
      return;
    }

    // ✅ jika lolos validasi, set ke form & tampilkan preview
    setValue('avatarUrl', file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  return {
    data,
    control,
    errors,
    preview,
    isPending,
    handleFileChange,
    handleSubmit,
    onSubmit,
  };
};
