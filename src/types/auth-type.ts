export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  data: { id: number; username: string };
}

export interface RegisterErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      phone: string;
      avatarUrl: string | null; // kalau bisa null pas belum upload avatar
    };
  };
}

export interface LoginErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
