import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { getMyLikes } from '@/services/likes-service';
import {
  GetMyLikesSuccessResponse,
  GetMyLikesErrorResponse,
} from '@/types/get-my-likes-type';

export const useGetMyLikes = (limit = 20) => {
  return useInfiniteQuery<
    GetMyLikesSuccessResponse, // TData (hasil API sukses)
    GetMyLikesErrorResponse, // TError (error dari API)
    InfiniteData<GetMyLikesSuccessResponse>, // TPage (tiap halaman hasil)
    ['myLikes'], // TQueryKey
    number // TPageParam (tipe pageParam)
  >({
    queryKey: ['myLikes'],
    queryFn: ({ pageParam = 1 }) => getMyLikes({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
