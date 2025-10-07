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

export const useCreateComment = (postId: number, username?: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCommentSuccessResponse,
    CreateCommentErrorResponse,
    CreateCommentParams
  >({
    mutationFn: (body: CreateCommentParams) => createComment(postId, body),

    onSuccess: (data) => {
      // ✅ Optimistic update ke cache komentar (halaman pertama saja)
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

      // ✅ Invalidate semua cache relevan agar sinkron
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({
        queryKey: ['postLikes', postId],
      });
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({
        queryKey: ['savedPosts', username, { limit: 20 }],
      });

      // Kalau ada username → invalidate juga user detail & user posts
      if (username) {
        queryClient.invalidateQueries({
          queryKey: ['userPosts', username, 20],
        });
        queryClient.invalidateQueries({ queryKey: ['userDetail', username] });
      }

      // ✅ invalidate 'me' agar komentar user muncul di profil sendiri
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },

    onError: (error) => {
      console.error('❌ Failed to create comment:', error);
    },
  });
};
