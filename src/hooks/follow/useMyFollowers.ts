import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyFollowers } from '@/services/follow-service';
import {
  GetMyFollowersSuccessResponse,
  GetMyFollowersErrorResponse,
} from '@/types/get-my-followers';

export const useMyFollowers = (limit = 20) => {
  return useInfiniteQuery<
    GetMyFollowersSuccessResponse,
    GetMyFollowersErrorResponse
  >({
    queryKey: ['myFollowers'],
    queryFn: ({ pageParam }) => {
      const page = Number(pageParam) || 1; // cast ke number
      return getMyFollowers({ page, limit });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di TanStack Query v5
  });
};
