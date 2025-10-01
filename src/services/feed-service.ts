import type { AxiosError } from 'axios';

import {
  GetFeedParams,
  GetFeedSuccessResponse,
  GetFeedErrorResponse,
} from '@/types/feed-type';

import { api } from './api';

export const getFeed = async (
  params?: GetFeedParams
): Promise<GetFeedSuccessResponse> => {
  try {
    const res = await api.get<GetFeedSuccessResponse>('/feed', { params });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<GetFeedErrorResponse>;
    if (error.response?.data) {
      // Lempar error yang sudah sesuai tipe GetFeedErrorResponse
      throw error.response.data;
    }

    // Fallback network / unknown error
    throw {
      success: false,
      message: error.message || 'Network error',
    } as GetFeedErrorResponse;
  }
};
