import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

import { getPostById } from '@/services/posts-service';
import { getSavedPosts } from '@/services/saves-service';
import type {
  PostDetail,
  GetPostByIdSuccessResponse,
} from '@/types/get-post-detail-type';
import type {
  GetSavedPostsParams,
  GetSavedPostsSuccessResponse,
  GetSavedPostsErrorResponse,
} from '@/types/get-saved-post';

export const useGetSavedPostsInfinite = (
  params?: Omit<GetSavedPostsParams, 'page'>
) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery<
    // ✅ hasil queryFn (sudah enriched dengan PostDetail[])
    GetSavedPostsSuccessResponse & { data: { posts: PostDetail[] } },
    GetSavedPostsErrorResponse,
    InfiniteData<
      GetSavedPostsSuccessResponse & { data: { posts: PostDetail[] } }
    >,
    [string, Omit<GetSavedPostsParams, 'page'>?],
    number
  >({
    queryKey: ['savedPosts', params],
    queryFn: async ({ pageParam = 1 }) => {
      const saved = await getSavedPosts({ ...params, page: pageParam });

      const enrichedPosts: PostDetail[] = await Promise.all(
        saved.data.posts.map(async (post) => {
          try {
            const detail = await getPostById(post.id);
            queryClient.setQueryData<GetPostByIdSuccessResponse>(
              ['post', post.id],
              detail
            );
            return detail.data;
          } catch {
            return {
              id: post.id,
              imageUrl: post.imageUrl,
              caption: post.caption,
              createdAt: post.createdAt,
              author: {
                id: 0,
                username: 'unknown',
                name: 'Unknown',
                avatarUrl: '/images/default-avatar.png',
              },
              likeCount: 0,
              commentCount: 0,
              likedByMe: false,
            } satisfies PostDetail;
          }
        })
      );

      return {
        ...saved,
        data: {
          ...saved.data,
          posts: enrichedPosts,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
