import { useQueryClient, useMutation } from '@tanstack/react-query';

import { likePost } from '@/services/likes-service';
import { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import {
  LikePostSuccessResponse,
  LikePostErrorResponse,
} from '@/types/post-like-type';

export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    LikePostSuccessResponse, // TData (hasil sukses mutation)
    LikePostErrorResponse, // TError (error dari API)
    void, // TVariables (gak dipakai karena postId sudah di luar)
    { prevData?: GetPostByIdSuccessResponse } // TContext (tipe cache sebelumnya)
  >({
    mutationFn: () => likePost({ id: postId }),

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
              likedByMe: !old.data.likedByMe,
              likeCount: old.data.likedByMe
                ? old.data.likeCount - 1
                : old.data.likeCount + 1,
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
