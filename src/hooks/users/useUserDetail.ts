import { useQuery } from '@tanstack/react-query';

import { getUserDetail } from '@/services/users-service';
import {
  UserDetailSuccessResponse,
  UserDetailErrorResponse,
} from '@/types/user-detail-type';

export const useUserDetail = (username: string) => {
  return useQuery<
    UserDetailSuccessResponse, // success type
    UserDetailErrorResponse, // error type
    UserDetailSuccessResponse, // returned data
    [string, string] // query key
  >({
    queryKey: ['userDetail', username],
    queryFn: () => getUserDetail(username),
    enabled: !!username, // hanya jalan kalau username ada
    staleTime: 1000 * 60 * 5, // cache 5 menit
  });
};
