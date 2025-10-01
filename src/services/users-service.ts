import { AxiosError } from 'axios';

import {
  UserLikesErrorResponse,
  UserLikesSuccessResponse,
} from '@/types/get-user-likes-type';
import {
  UserPostsSuccessResponse,
  UserPostsErrorResponse,
} from '@/types/get-user-post-type';
import {
  UserDetailSuccessResponse,
  UserDetailErrorResponse,
} from '@/types/user-detail-type';
import {
  UserSearchSuccessResponse,
  UserSearchErrorResponse,
} from '@/types/user-search-type';

import { api } from './api';

export const getUserLikes = async (
  username: string,
  page = 1,
  limit = 20
): Promise<UserLikesSuccessResponse> => {
  try {
    const { data } = await api.get<UserLikesSuccessResponse>(
      `/api/users/${username}/likes`,
      {
        params: { page, limit },
      }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UserLikesErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: error.message || 'Network error',
    } as UserLikesErrorResponse;
  }
};

export const getUserPosts = async (
  username: string,
  page = 1,
  limit = 20
): Promise<UserPostsSuccessResponse> => {
  try {
    const { data } = await api.get<UserPostsSuccessResponse>(
      `/api/users/${username}/posts`,
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UserPostsErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UserPostsErrorResponse;
  }
};

export const searchUsers = async (
  q: string,
  page = 1,
  limit = 20
): Promise<UserSearchSuccessResponse> => {
  try {
    const { data } = await api.get<UserSearchSuccessResponse>(
      '/api/users/search',
      { params: { q, page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UserSearchErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UserSearchErrorResponse;
  }
};

export const getUserDetail = async (
  username: string
): Promise<UserDetailSuccessResponse> => {
  try {
    const { data } = await api.get<UserDetailSuccessResponse>(
      `/api/users/${username}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UserDetailErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UserDetailErrorResponse;
  }
};
