// hooks/auth/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner'; // shadcn toast (pakai sonner)

import { errorToast, successToast } from '@/lib/toast-helper';
import { registerUser } from '@/services/auth-service';
import {
  RegisterSuccessResponse,
  RegisterErrorResponse,
  RegisterRequest,
} from '@/types/auth-type';

export const useRegister = () => {
  return useMutation<
    RegisterSuccessResponse,
    RegisterErrorResponse,
    RegisterRequest
  >({
    mutationFn: (payload: RegisterRequest) => registerUser(payload),
    onSuccess: (data) => {
      successToast(data.message || 'Register success 🎉');
    },
    onError: (error) => {
      // error bisa datang dari server
      if (error?.errors) {
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        errorToast(error.message || 'Register failed ❌');
      }
    },
  });
};
