import { AxiosError } from 'axios';

import {
  CreatePostRequest,
  CreatePostSuccessResponse,
  CreatePostErrorResponse,
} from '@/types/create-post-type';
import {
  DeletePostSuccessResponse,
  DeletePostErrorResponse,
} from '@/types/delete-post-type';
import {
  GetPostByIdSuccessResponse,
  GetPostByIdErrorResponse,
} from '@/types/get-post-detail-type';

import { api } from './api';

export const createPost = async (
  payload: CreatePostRequest
): Promise<CreatePostSuccessResponse> => {
  try {
    const { data } = await api.post<CreatePostSuccessResponse>(
      '/api/posts',
      payload
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<CreatePostErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as CreatePostErrorResponse;
  }
};

export const getPostById = async (
  id: number
): Promise<GetPostByIdSuccessResponse> => {
  try {
    const { data } = await api.get<GetPostByIdSuccessResponse>(
      `/api/posts/${id}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetPostByIdErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetPostByIdErrorResponse;
  }
};

export const deletePost = async (
  id: number
): Promise<DeletePostSuccessResponse> => {
  try {
    const { data } = await api.delete<DeletePostSuccessResponse>(
      `/api/posts/${id}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<DeletePostErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as DeletePostErrorResponse;
  }
};
