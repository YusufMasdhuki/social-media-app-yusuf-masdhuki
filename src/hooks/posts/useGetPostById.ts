import { useQuery } from '@tanstack/react-query';

import { getPostById } from '@/services/posts-service';
import {
  GetPostByIdSuccessResponse,
  GetPostByIdErrorResponse,
} from '@/types/get-post-detail-type';

export const useGetPostById = (id: number, enabled = true) => {
  return useQuery<GetPostByIdSuccessResponse, GetPostByIdErrorResponse>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    enabled: enabled && !!id, // hanya jalan kalau id valid & enabled true
  });
};
