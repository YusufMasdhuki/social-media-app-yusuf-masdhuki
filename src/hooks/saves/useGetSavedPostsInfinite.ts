import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

import { getSavedPosts } from '@/services/saves-service';
import {
  GetSavedPostsParams,
  GetSavedPostsSuccessResponse,
  GetSavedPostsErrorResponse,
} from '@/types/get-saved-post';

export const useGetSavedPostsInfinite = (
  params?: Omit<GetSavedPostsParams, 'page'>
) => {
  return useInfiniteQuery<
    GetSavedPostsSuccessResponse, // TQueryFnData (hasil queryFn)
    GetSavedPostsErrorResponse, // TError
    InfiniteData<GetSavedPostsSuccessResponse>, // TData
    [string, Omit<GetSavedPostsParams, 'page'>?], // TQueryKey (array)
    number // TPageParam
  >({
    queryKey: ['savedPosts', params],
    queryFn: ({ pageParam = 1 }) =>
      getSavedPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
