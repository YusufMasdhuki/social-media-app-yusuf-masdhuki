import { AxiosError } from 'axios';

import {
  FollowUserParams,
  FollowUserSuccessResponse,
  FollowUserErrorResponse,
  UnfollowUserErrorResponse,
  UnfollowUserParams,
  UnfollowUserSuccessResponse,
} from '@/types/follow-user-type';
import {
  GetFollowersParams,
  GetFollowersSuccessResponse,
  GetFollowersErrorResponse,
} from '@/types/get-followers-type';
import {
  GetFollowingParams,
  GetFollowingSuccessResponse,
  GetFollowingErrorResponse,
} from '@/types/get-following-type';
import {
  GetMyFollowersParams,
  GetMyFollowersSuccessResponse,
  GetMyFollowersErrorResponse,
} from '@/types/get-my-followers';
import {
  GetMyFollowingParams,
  GetMyFollowingSuccessResponse,
  GetMyFollowingErrorResponse,
} from '@/types/get-my-following-type';

import { api } from './api';

export const followUser = async (
  params: FollowUserParams
): Promise<FollowUserSuccessResponse> => {
  try {
    const { data } = await api.post<FollowUserSuccessResponse>(
      `/api/follow/${params.username}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<FollowUserErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as FollowUserErrorResponse;
  }
};

export const unfollowUser = async ({
  username,
}: UnfollowUserParams): Promise<UnfollowUserSuccessResponse> => {
  try {
    const { data } = await api.delete<UnfollowUserSuccessResponse>(
      `/api/follow/${username}`
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UnfollowUserErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UnfollowUserErrorResponse;
  }
};

export const getFollowers = async ({
  username,
  page = 1,
  limit = 20,
}: GetFollowersParams): Promise<GetFollowersSuccessResponse> => {
  try {
    const { data } = await api.get<GetFollowersSuccessResponse>(
      `/api/users/${username}/followers`,
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetFollowersErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetFollowersErrorResponse;
  }
};

export const getFollowing = async ({
  username,
  page = 1,
  limit = 20,
}: GetFollowingParams): Promise<GetFollowingSuccessResponse> => {
  try {
    const { data } = await api.get<GetFollowingSuccessResponse>(
      `/api/users/${username}/following`,
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetFollowingErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetFollowingErrorResponse;
  }
};

export const getMyFollowers = async ({
  page = 1,
  limit = 20,
}: GetMyFollowersParams = {}): Promise<GetMyFollowersSuccessResponse> => {
  try {
    const { data } = await api.get<GetMyFollowersSuccessResponse>(
      '/api/me/followers',
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetMyFollowersErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetMyFollowersErrorResponse;
  }
};

export const getMyFollowing = async ({
  page = 1,
  limit = 20,
}: GetMyFollowingParams = {}): Promise<GetMyFollowingSuccessResponse> => {
  try {
    const { data } = await api.get<GetMyFollowingSuccessResponse>(
      '/api/me/following',
      { params: { page, limit } }
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<GetMyFollowingErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetMyFollowingErrorResponse;
  }
};
