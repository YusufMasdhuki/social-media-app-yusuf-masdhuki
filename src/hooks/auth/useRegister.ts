// hooks/auth/useRegister.ts
import { useMutation } from '@tanstack/react-query';

import { registerUser } from '@/services/auth-service';
import {
  RegisterSuccessResponse,
  RegisterErrorResponse,
  RegisterRequest,
} from '@/types/auth-type';

export const useRegister = () => {
  return useMutation<
    RegisterSuccessResponse, // Tipe data sukses
    RegisterErrorResponse, // Tipe error
    RegisterRequest // Tipe payload
  >({
    mutationFn: (payload: RegisterRequest) => registerUser(payload),
  });
};
