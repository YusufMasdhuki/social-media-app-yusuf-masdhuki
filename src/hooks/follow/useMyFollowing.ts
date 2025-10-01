import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyFollowing } from '@/services/follow-service';
import {
  GetMyFollowingSuccessResponse,
  GetMyFollowingErrorResponse,
} from '@/types/get-my-following-type';

export const useMyFollowing = (limit = 20) => {
  return useInfiniteQuery<
    GetMyFollowingSuccessResponse,
    GetMyFollowingErrorResponse
  >({
    queryKey: ['myFollowing'],
    queryFn: ({ pageParam }) => {
      const page = Number(pageParam) || 1; // cast ke number
      return getMyFollowing({ page, limit });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di TanStack Query v5
  });
};
