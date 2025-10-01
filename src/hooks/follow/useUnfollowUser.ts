import { useQueryClient, useMutation } from '@tanstack/react-query';

import { unfollowUser } from '@/services/follow-service';
import {
  UnfollowUserSuccessResponse,
  UnfollowUserErrorResponse,
  UnfollowUserParams,
} from '@/types/follow-user-type';
import { UserDetailSuccessResponse } from '@/types/user-detail-type';

export const useUnfollowUser = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    UnfollowUserSuccessResponse,
    UnfollowUserErrorResponse,
    UnfollowUserParams
  >({
    mutationFn: () => unfollowUser({ username }),
    onSuccess: (data) => {
      queryClient.setQueryData<UserDetailSuccessResponse>(
        ['userProfile', username],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              isFollowing: data.data.following,
              counts: {
                ...old.data.counts,
                followers: Math.max(old.data.counts.followers - 1, 0),
              },
            },
          };
        }
      );
    },
  });
};
