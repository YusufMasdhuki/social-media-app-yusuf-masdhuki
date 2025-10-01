import { AxiosError } from 'axios';

import {
  CreateCommentParams,
  CreateCommentSuccessResponse,
  CreateCommentErrorResponse,
} from '@/types/create-comment-type';
import {
  DeleteCommentSuccessResponse,
  DeleteCommentErrorResponse,
} from '@/types/delete-comment-type';
import {
  GetPostCommentsParams,
  GetPostCommentsSuccessResponse,
  GetPostCommentsErrorResponse,
} from '@/types/get-post-comments-type';

import { api } from './api';

export const getPostComments = async (
  id: number,
  params?: GetPostCommentsParams
): Promise<GetPostCommentsSuccessResponse> => {
  try {
    const { page = 1, limit = 10 } = params || {};
    const { data } = await api.get<GetPostCommentsSuccessResponse>(
      `/api/posts/${id}/comments`,
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetPostCommentsErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetPostCommentsErrorResponse;
  }
};

export const createComment = async (
  postId: number,
  body: CreateCommentParams
): Promise<CreateCommentSuccessResponse> => {
  try {
    const { data } = await api.post<CreateCommentSuccessResponse>(
      `/api/posts/${postId}/comments`,
      body
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<CreateCommentErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as CreateCommentErrorResponse;
  }
};

export const deleteComment = async (
  id: number
): Promise<DeleteCommentSuccessResponse> => {
  try {
    const { data } = await api.delete<DeleteCommentSuccessResponse>(
      `/api/comments/${id}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<DeleteCommentErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as DeleteCommentErrorResponse;
  }
};
