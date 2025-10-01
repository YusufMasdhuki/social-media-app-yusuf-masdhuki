import { useInfiniteQuery } from '@tanstack/react-query';

import { getFollowers } from '@/services/follow-service';
import {
  GetFollowersSuccessResponse,
  GetFollowersErrorResponse,
} from '@/types/get-followers-type';

export const useFollowers = (username: string, limit = 20) => {
  return useInfiniteQuery<
    GetFollowersSuccessResponse,
    GetFollowersErrorResponse
  >({
    queryKey: ['followers', username],
    queryFn: ({ pageParam }) => {
      const page = Number(pageParam) || 1; // <- cast ke number supaya TypeScript happy
      return getFollowers({ username, page, limit });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di TanStack Query v5
  });
};
