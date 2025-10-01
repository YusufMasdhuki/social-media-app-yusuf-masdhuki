import { useQueryClient, useMutation } from '@tanstack/react-query';

import { unsavePost } from '@/services/saves-service';
import { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import {
  UnsavePostSuccessResponse,
  UnsavePostErrorResponse,
} from '@/types/unsave-post-type';

export const useUnsavePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    UnsavePostSuccessResponse, // TData (success response)
    UnsavePostErrorResponse, // TError (error response)
    void, // TVariables (postId sudah di luar)
    { prevData?: GetPostByIdSuccessResponse } // TContext (buat rollback cache)
  >({
    mutationFn: () => unsavePost({ id: postId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const prevData = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);

      // Optimistic update: langsung set isSaved = false
      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              isSaved: false,
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
