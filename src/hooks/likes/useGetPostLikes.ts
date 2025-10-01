import { useInfiniteQuery } from '@tanstack/react-query';

import { getPostLikes } from '@/services/likes-service';
import {
  GetPostLikesSuccessResponse,
  GetPostLikesErrorResponse,
} from '@/types/get-post-likes-type';

export const useGetPostLikes = (id: number, limit = 20) => {
  return useInfiniteQuery<
    GetPostLikesSuccessResponse, // TData
    GetPostLikesErrorResponse, // TError
    GetPostLikesSuccessResponse, // TPage
    [_: string, number], // TQueryKey
    number // TPageParam (tipe pageParam)
  >({
    queryKey: ['postLikes', id],
    queryFn: ({ pageParam = 1 }) =>
      getPostLikes({ id, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
