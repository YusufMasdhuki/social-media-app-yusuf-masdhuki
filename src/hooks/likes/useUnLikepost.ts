import { useQueryClient, useMutation } from '@tanstack/react-query';

import { unlikePost } from '@/services/likes-service';
import { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import {
  UnlikePostSuccessResponse,
  UnlikePostErrorResponse,
} from '@/types/post-like-type';

export const useUnlikePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    UnlikePostSuccessResponse,
    UnlikePostErrorResponse,
    void,
    { prevData?: GetPostByIdSuccessResponse }
  >({
    mutationFn: () => unlikePost(postId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const prevData = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);

      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              likedByMe: false,
              likeCount: Math.max(old.data.likeCount - 1, 0),
            },
          };
        }
      );

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(['post', postId], ctx.prevData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};
