import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    queryKey: ['me'], // cache key unik
    queryFn: getMe, // function yang dipanggil
    retry: false, // jangan retry kalau unauthorized
  });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMeSuccessResponse, // tipe sukses
    UpdateMeErrorResponse, // tipe error
    UpdateMeRequest // payload request
  >({
    mutationFn: updateMe,
    onSuccess: () => {
      // refresh cache "me" setelah update
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
