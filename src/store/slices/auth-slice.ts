import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/types/user-type';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

function safeJSONParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    console.warn('Failed to parse JSON from localStorage:', value);
    return null;
  }
}

const storedToken =
  typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
const storedUser =
  typeof window !== 'undefined'
    ? safeJSONParse<User>(localStorage.getItem('auth_user'))
    : null;

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
