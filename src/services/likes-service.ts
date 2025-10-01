import { AxiosError } from 'axios';

import {
  GetMyLikesParams,
  GetMyLikesSuccessResponse,
  GetMyLikesErrorResponse,
} from '@/types/get-my-likes-type';
import {
  GetPostLikesParams,
  GetPostLikesSuccessResponse,
  GetPostLikesErrorResponse,
} from '@/types/get-post-likes-type';
import {
  LikePostErrorResponse,
  LikePostParams,
  LikePostSuccessResponse,
  UnlikePostErrorResponse,
  UnlikePostSuccessResponse,
} from '@/types/post-like-type';

import { api } from './api';

export const likePost = async ({
  id,
}: LikePostParams): Promise<LikePostSuccessResponse> => {
  try {
    const { data } = await api.post<LikePostSuccessResponse>(
      `/api/posts/${id}/like`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<LikePostErrorResponse>;

    if (error.response?.data) {
      throw error.response.data; // lempar error dari API
    }

    throw {
      success: false,
      message: error.message || 'Network error',
    } as LikePostErrorResponse;
  }
};

export const unlikePost = async (
  id: number
): Promise<UnlikePostSuccessResponse> => {
  try {
    const { data } = await api.delete<UnlikePostSuccessResponse>(
      `/api/posts/${id}/like`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UnlikePostErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UnlikePostErrorResponse;
  }
};

export const getPostLikes = async (
  params: GetPostLikesParams
): Promise<GetPostLikesSuccessResponse> => {
  try {
    const { id, page = 1, limit = 20 } = params;
    const { data } = await api.get<GetPostLikesSuccessResponse>(
      `/api/posts/${id}/likes`,
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetPostLikesErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetPostLikesErrorResponse;
  }
};

export const getMyLikes = async (
  params?: GetMyLikesParams
): Promise<GetMyLikesSuccessResponse> => {
  try {
    const { page = 1, limit = 20 } = params || {};
    const { data } = await api.get<GetMyLikesSuccessResponse>('/api/me/likes', {
      params: { page, limit },
    });
    return data;
  } catch (err) {
    const error = err as AxiosError<GetMyLikesErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetMyLikesErrorResponse;
  }
};
