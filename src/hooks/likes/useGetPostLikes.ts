import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import { getPostLikes } from '@/services/likes-service';
import type {
  GetPostLikesSuccessResponse,
  GetPostLikesErrorResponse,
} from '@/types/get-post-likes-type';

export const useGetPostLikes = (id: number, limit = 20) => {
  return useInfiniteQuery<
    GetPostLikesSuccessResponse,
    GetPostLikesErrorResponse,
    InfiniteData<GetPostLikesSuccessResponse>,
    ['postLikes', number, number],
    number
  >({
    queryKey: ['postLikes', id, limit],
    queryFn: ({ pageParam = 1 }) =>
      getPostLikes({ id, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
