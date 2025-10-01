import { useQueryClient, useMutation } from '@tanstack/react-query';

import { savePost } from '@/services/saves-service';
import { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import {
  SavePostSuccessResponse,
  SavePostErrorResponse,
} from '@/types/save-post-type';

export const useSavePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    SavePostSuccessResponse, // TData (response sukses)
    SavePostErrorResponse, // TError (response error)
    void, // TVariables (gak perlu, karena postId dari luar)
    { prevData?: GetPostByIdSuccessResponse } // TContext (buat rollback cache)
  >({
    mutationFn: () => savePost({ id: postId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const prevData = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);

      // Optimistic update
      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              // toggle save status misalnya
              isSaved: !('isSaved' in old.data ? old.data.isSaved : false),
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
