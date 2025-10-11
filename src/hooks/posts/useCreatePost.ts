'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { errorToast, successToast } from '@/lib/toast-helper';
import { createPost } from '@/services/posts-service';
import type {
  CreatePostSuccessResponse,
  CreatePostErrorResponse,
  CreatePostRequest,
} from '@/types/create-post-type';

export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    CreatePostSuccessResponse,
    CreatePostErrorResponse,
    CreatePostRequest
  >({
    mutationFn: (payload) => createPost(payload),

    onSuccess: () => {
      successToast('Post created successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTimeout(() => router.replace('/'), 800);
    },

    onError: (error) => {
      errorToast(error.message || 'Failed to create post.');
    },
  });
};
