import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deletePost } from '@/services/posts-service';
import {
  DeletePostSuccessResponse,
  DeletePostErrorResponse,
} from '@/types/delete-post-type';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeletePostSuccessResponse,
    DeletePostErrorResponse,
    number
  >({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      // invalidate cache agar list post auto refresh
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
