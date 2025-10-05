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
      // Ambil data lama dari useInfiniteQuery
      queryClient.setQueryData<InfiniteData<GetPostCommentsSuccessResponse>>(
        ['postComments', postId],
        (oldData) => {
          if (!oldData) return oldData;

          // update halaman pertama saja
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
      queryClient.invalidateQueries({ queryKey: ['feed'], exact: true });
    },
  });
};
