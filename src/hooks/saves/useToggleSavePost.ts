import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

import { savePost, unsavePost } from '@/services/saves-service';
import type {
  GetPostByIdSuccessResponse,
  PostDetail,
} from '@/types/get-post-detail-type';
import type {
  SavePostSuccessResponse,
  SavePostErrorResponse,
} from '@/types/save-post-type';
import type {
  UnsavePostSuccessResponse,
  UnsavePostErrorResponse,
} from '@/types/unsave-post-type';

// ✅ tipe untuk infinite data (feed, savedPosts, dsb)
type InfinitePostsData = InfiniteData<{
  success: boolean;
  message: string;
  data: {
    posts: PostDetail[];
    pagination?: { page: number; totalPages: number };
  };
}>;

export const useToggleSavePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    SavePostSuccessResponse | UnsavePostSuccessResponse, // ✅ success response
    SavePostErrorResponse | UnsavePostErrorResponse, // ✅ error response
    { save: boolean }, // ✅ variables
    { prevData?: GetPostByIdSuccessResponse } // ✅ context
  >({
    mutationFn: async ({ save }) =>
      save ? await savePost({ id: postId }) : await unsavePost({ id: postId }),

    onMutate: async ({ save }) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const prevData = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);

      // ✅ Optimistic UI: langsung ubah cache post detail
      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) =>
          old
            ? {
                ...old,
                data: { ...old.data, isSaved: save },
              }
            : old
      );

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(['post', postId], ctx.prevData);
      }
    },

    onSuccess: (data) => {
      const saved = 'data' in data ? data.data.saved : undefined;

      const updateCaches = (key: string) => {
        queryClient.setQueriesData<InfinitePostsData>(
          { queryKey: [key] },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts
                    .map((p) =>
                      p.id === postId ? { ...p, isSaved: saved ?? false } : p
                    )
                    .filter((p) => (key === 'savedPosts' ? p.isSaved : true)), // ✅ hanya filter savedPosts
                },
              })),
            };
          }
        );
      };

      updateCaches('feed');
      updateCaches('userPosts');
      updateCaches('savedPosts');

      // ✅ update juga detail post cache
      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  isSaved: saved ?? old.data.isSaved ?? false,
                },
              }
            : old
      );
    },
  });
};
