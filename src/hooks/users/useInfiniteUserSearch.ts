import { useInfiniteQuery } from '@tanstack/react-query';

import { searchUsers } from '@/services/users-service';
import {
  UserSearchSuccessResponse,
  UserSearchErrorResponse,
} from '@/types/user-search-type';

export const useInfiniteUserSearch = (q: string, limit = 20) => {
  return useInfiniteQuery<
    UserSearchSuccessResponse, // success response type
    UserSearchErrorResponse, // error type
    UserSearchSuccessResponse, // returned data type
    [string, string, number], // query key
    number // pageParam type
  >({
    queryKey: ['userSearch', q, limit],
    queryFn: ({ pageParam = 1 }) => searchUsers(q, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!q, // hanya jalan kalau ada query
  });
};
