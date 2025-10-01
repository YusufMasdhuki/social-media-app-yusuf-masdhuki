import { AxiosError } from 'axios';

import {
  GetSavedPostsParams,
  GetSavedPostsSuccessResponse,
  GetSavedPostsErrorResponse,
} from '@/types/get-saved-post';
import {
  SavePostParams,
  SavePostSuccessResponse,
  SavePostErrorResponse,
} from '@/types/save-post-type';
import {
  UnsavePostParams,
  UnsavePostSuccessResponse,
  UnsavePostErrorResponse,
} from '@/types/unsave-post-type';

import { api } from './api';

export const savePost = async ({
  id,
}: SavePostParams): Promise<SavePostSuccessResponse> => {
  try {
    const { data } = await api.post<SavePostSuccessResponse>(
      `/api/posts/${id}/save`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<SavePostErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as SavePostErrorResponse;
  }
};

export const unsavePost = async ({
  id,
}: UnsavePostParams): Promise<UnsavePostSuccessResponse> => {
  try {
    const { data } = await api.delete<UnsavePostSuccessResponse>(
      `/api/posts/${id}/save`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UnsavePostErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UnsavePostErrorResponse;
  }
};

export const getSavedPosts = async (
  params?: GetSavedPostsParams
): Promise<GetSavedPostsSuccessResponse> => {
  try {
    const { data } = await api.get<GetSavedPostsSuccessResponse>(
      '/api/me/saved',
      { params }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetSavedPostsErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetSavedPostsErrorResponse;
  }
};
