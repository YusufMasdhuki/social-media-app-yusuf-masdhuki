import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

import { createComment } from '@/services/comments-service';
import {
  CreateCommentSuccessResponse,
  CreateCommentErrorResponse,
  CreateCommentParams,
} from '@/types/create-comment-type';
import { GetPostCommentsSuccessResponse } from '@/types/get-post-comments-type';

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCommentSuccessResponse,
    CreateCommentErrorResponse,
    CreateCommentParams
  >({
    mutationFn: (body: CreateCommentParams) => createComment(postId, body),
    onSuccess: (data) => {
      // 🔹 Update komentar lokal di cache usePostComments
      queryClient.setQueryData<InfiniteData<GetPostCommentsSuccessResponse>>(
        ['postComments', postId],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  comments: [data.data, ...page.data.comments],
                  pagination: {
                    ...page.data.pagination,
                    total: page.data.pagination.total + 1,
                  },
                },
              };
            }
            return page;
          });

          return { ...oldData, pages: updatedPages };
        }
      );

      // 🔹 Invalidate feed dan userPosts agar sync jumlah komentar
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
};
