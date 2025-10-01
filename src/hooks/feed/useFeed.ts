import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeed } from '@/services/feed-service';
import {
  GetFeedSuccessResponse,
  GetFeedErrorResponse,
} from '@/types/feed-type';

export const useFeed = (limit = 10) => {
  return useInfiniteQuery<GetFeedSuccessResponse, GetFeedErrorResponse>({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) =>
      getFeed({ page: Number(pageParam) || 1, limit }), // <- cast ke number
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di TanStack Query v5
  });
};
