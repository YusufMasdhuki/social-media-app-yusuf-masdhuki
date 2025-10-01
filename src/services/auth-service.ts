import { AxiosError } from 'axios';

import {
  RegisterRequest,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  LoginErrorResponse,
  LoginRequest,
  LoginSuccessResponse,
} from '@/types/auth-type';

import { api } from './api';

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterSuccessResponse> => {
  try {
    const { data } = await api.post<RegisterSuccessResponse>(
      '/api/auth/register',
      payload
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<RegisterErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error',
    } as RegisterErrorResponse;
  }
};

export const loginUser = async (
  payload: LoginRequest
): Promise<LoginSuccessResponse> => {
  try {
    const { data } = await api.post<LoginSuccessResponse>(
      '/api/auth/login',
      payload
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<LoginErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: error.message || 'Network error',
    } as LoginErrorResponse;
  }
};
