import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from '@tanstack/react-query';

import { deleteComment } from '@/services/comments-service';
import {
  DeleteCommentSuccessResponse,
  DeleteCommentErrorResponse,
} from '@/types/delete-comment-type';
import { GetPostCommentsSuccessResponse } from '@/types/get-post-comments-type';

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteCommentSuccessResponse,
    DeleteCommentErrorResponse,
    number // id comment yang akan dihapus
  >({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Update cache untuk hapus komentar dari list
      queryClient.setQueryData<InfiniteData<GetPostCommentsSuccessResponse>>(
        ['postComments', postId],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              comments: page.data.comments.filter((c) => c.id !== commentId),
              pagination: {
                ...page.data.pagination,
                total: page.data.pagination.total - 1,
              },
            },
          }));

          return { ...oldData, pages: updatedPages };
        }
      );
    },
  });
};
