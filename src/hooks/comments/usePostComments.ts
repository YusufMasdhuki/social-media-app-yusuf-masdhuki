import { useInfiniteQuery } from '@tanstack/react-query';

import { getPostComments } from '@/services/comments-service';
import {
  GetPostCommentsSuccessResponse,
  GetPostCommentsErrorResponse,
} from '@/types/get-post-comments-type';

export const usePostComments = (postId: number, limit = 10) => {
  return useInfiniteQuery<
    GetPostCommentsSuccessResponse,
    GetPostCommentsErrorResponse
  >({
    queryKey: ['postComments', postId],
    queryFn: ({ pageParam }) =>
      getPostComments(postId, { page: Number(pageParam) || 1, limit }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
    initialPageParam: 1, // wajib di v5
  });
};
