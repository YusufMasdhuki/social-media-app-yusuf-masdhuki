'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { errorToast, successToast } from '@/lib/toast-helper';
import { loginUser } from '@/services/auth-service';
import type { AppDispatch } from '@/store';
import { setToken, setUser } from '@/store/slices/auth-slice';
import {
  LoginSuccessResponse,
  LoginErrorResponse,
  LoginRequest,
} from '@/types/auth-type';

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginSuccessResponse, LoginErrorResponse, LoginRequest>({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: async (data) => {
      successToast(data.message || 'Login successful');

      // Simpan token
      const token = data.data.token;
      dispatch(setToken(token));

      // Simpan user
      dispatch(setUser(data.data.user));

      // invalidate supaya useGetMe refetch
      await queryClient.invalidateQueries({ queryKey: ['me'] });

      // redirect ke home
      router.push('/');
    },

    onError: (error) => {
      if (error?.errors) {
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        errorToast(error.message || 'Login failed ❌');
      }
    },
  });
};
