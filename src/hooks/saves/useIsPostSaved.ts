import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { GetSavedPostsSuccessResponse } from '@/types/get-saved-post';

type SavedPostsCache = InfiniteData<GetSavedPostsSuccessResponse>;

export function useIsPostSaved(postId: number): boolean {
  const queryClient = useQueryClient();

  return useMemo(() => {
    const cache = queryClient.getQueryData<SavedPostsCache>(['savedPosts']);
    const pages = cache?.pages ?? [];

    const ids = new Set<number>();
    for (const page of pages) {
      for (const post of page.data.posts) {
        ids.add(post.id);
      }
    }

    return ids.has(postId);
  }, [queryClient, postId]);
}
