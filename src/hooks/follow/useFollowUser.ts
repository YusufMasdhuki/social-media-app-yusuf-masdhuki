import { useQueryClient, useMutation } from '@tanstack/react-query';

import { followUser } from '@/services/follow-service';
import {
  FollowUserSuccessResponse,
  FollowUserErrorResponse,
  FollowUserParams,
} from '@/types/follow-user-type';
import { UserDetailSuccessResponse } from '@/types/user-detail-type';

export const useFollowUser = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    FollowUserSuccessResponse,
    FollowUserErrorResponse,
    FollowUserParams
  >({
    mutationFn: () => followUser({ username }),
    onSuccess: (data) => {
      queryClient.setQueryData<UserDetailSuccessResponse>(
        ['userProfile', username], // cache key sama seperti saat fetch user profile
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              isFollowing: data.data.following, // update properti isFollowing
              counts: {
                ...old.data.counts,
                followers: data.data.following
                  ? old.data.counts.followers + 1
                  : old.data.counts.followers,
              },
            },
          };
        }
      );
    },
  });
};
