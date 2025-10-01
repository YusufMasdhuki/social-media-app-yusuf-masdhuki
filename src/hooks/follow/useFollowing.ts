import { useInfiniteQuery } from '@tanstack/react-query';

import { getFollowing } from '@/services/follow-service';
import {
  GetFollowingSuccessResponse,
  GetFollowingErrorResponse,
} from '@/types/get-following-type';

export const useFollowing = (username: string, limit = 20) => {
  return useInfiniteQuery<
    GetFollowingSuccessResponse,
    GetFollowingErrorResponse
  >({
    queryKey: ['following', username],
    queryFn: ({ pageParam }) => {
      const page = Number(pageParam) || 1; // cast ke number
      return getFollowing({ username, page, limit });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di TanStack Query v5
  });
};
