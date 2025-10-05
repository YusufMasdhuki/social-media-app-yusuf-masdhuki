'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { errorToast, successToast } from '@/lib/toast-helper';
import { getMe, updateMe } from '@/services/my-profile-service';
import {
  MeSuccessResponse,
  MeErrorResponse,
  UpdateMeErrorResponse,
  UpdateMeRequest,
  UpdateMeSuccessResponse,
} from '@/types/me-type';

export const useGetMe = () =>
  useQuery<MeSuccessResponse, MeErrorResponse>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    UpdateMeSuccessResponse,
    UpdateMeErrorResponse,
    UpdateMeRequest
  >({
    mutationFn: updateMe,
    onSuccess: () => {
      // ✅ invalidate cache
      queryClient.invalidateQueries({ queryKey: ['me'] });

      // ✅ tampilkan toast sukses
      successToast('Profil berhasil diperbarui!');

      // ✅ redirect ke halaman profil
      router.push('/myProfile');
    },
    onError: (error) => {
      // ✅ tampilkan toast error
      errorToast(error.message || 'Gagal memperbarui profil');
    },
  });
};
