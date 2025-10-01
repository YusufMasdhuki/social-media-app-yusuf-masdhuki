import { AxiosError } from 'axios';

import {
  MeErrorResponse,
  MeSuccessResponse,
  UpdateMeErrorResponse,
  UpdateMeRequest,
  UpdateMeSuccessResponse,
} from '@/types/me-type';

import { api } from './api';

export const getMe = async (): Promise<MeSuccessResponse> => {
  try {
    const { data } = await api.get<MeSuccessResponse>('/api/me');
    return data;
  } catch (err) {
    const error = err as AxiosError<MeErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: error.message || 'Network error',
    } as MeErrorResponse;
  }
};

export const updateMe = async (
  payload: UpdateMeRequest
): Promise<UpdateMeSuccessResponse> => {
  try {
    const { data } = await api.patch<UpdateMeSuccessResponse>(
      '/api/me',
      payload
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<UpdateMeErrorResponse>;
    if (error.response?.data) {
      throw error.response.data; // error terstruktur dari API
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as UpdateMeErrorResponse;
  }
};
