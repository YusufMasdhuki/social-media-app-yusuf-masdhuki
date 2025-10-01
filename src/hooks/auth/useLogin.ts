import { useMutation } from '@tanstack/react-query';

import { loginUser } from '@/services/auth-service';
import {
  LoginSuccessResponse,
  LoginErrorResponse,
  LoginRequest,
} from '@/types/auth-type';

export const useLogin = () => {
  return useMutation<
    LoginSuccessResponse, // tipe response sukses
    LoginErrorResponse, // tipe response error
    LoginRequest // tipe payload request
  >({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
  });
};
