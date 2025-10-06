import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { getUserLikes } from '@/services/users-service';
import {
  UserLikesSuccessResponse,
  UserLikesErrorResponse,
} from '@/types/get-user-likes-type';

export const useInfiniteUserLikes = (username: string, limit = 20) => {
  return useInfiniteQuery<
    UserLikesSuccessResponse, // data success
    UserLikesErrorResponse, // error
    InfiniteData<UserLikesSuccessResponse>, // data select (biarin sama aja)
    [string, string, number], // queryKey tuple type
    number // pageParam type ⬅️ ini kuncinya
  >({
    queryKey: ['userLikes', username, limit],
    queryFn: ({ pageParam = 1 }) => getUserLikes(username, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username,
  });
};
