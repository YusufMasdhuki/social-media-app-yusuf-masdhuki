import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { getUserPosts } from '@/services/users-service';
import {
  UserPostsSuccessResponse,
  UserPostsErrorResponse,
} from '@/types/get-user-post-type';

export const useInfiniteUserPosts = (username: string, limit = 20) => {
  return useInfiniteQuery<
    UserPostsSuccessResponse, // success response type
    UserPostsErrorResponse, // error type
    InfiniteData<UserPostsSuccessResponse>, // data type setelah select (biarin sama aja)
    [string, string, number], // query key type
    number // pageParam type
  >({
    queryKey: ['userPosts', username, limit],
    queryFn: ({ pageParam = 1 }) => getUserPosts(username, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username,
  });
};
