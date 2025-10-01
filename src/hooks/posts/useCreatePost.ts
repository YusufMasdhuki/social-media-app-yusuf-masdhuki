import { useQueryClient, useMutation } from '@tanstack/react-query';

import { createPost } from '@/services/posts-service';
import {
  CreatePostSuccessResponse,
  CreatePostErrorResponse,
  CreatePostRequest,
} from '@/types/create-post-type';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePostSuccessResponse, // success response
    CreatePostErrorResponse, // error response
    CreatePostRequest // payload
  >({
    mutationFn: (payload) => createPost(payload),
    onSuccess: () => {
      // contoh: invalidasi cache agar daftar post ter-refresh
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
