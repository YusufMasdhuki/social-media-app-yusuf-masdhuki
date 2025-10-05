// types/me-type.ts
export interface MeProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface MeStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface MeSuccessResponse {
  success: true;
  message: string; // "OK"
  data: {
    profile: MeProfile;
    stats: MeStats;
  };
}

export interface MeErrorResponse {
  success: false;
  message: string; // misalnya "Unauthorized"
}

export interface UpdateMeRequest {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string | null;
  avatarUrl?: File | null;
}
export interface UpdateMeSuccessResponse {
  success: true;
  message: string; // "Profile updated"
  data: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string | null;
    avatarUrl: string | null;
    updatedAt: string;
  };
}
export interface UpdateMeErrorResponse {
  success: false;
  message: string; // "Validation error" | "Duplicate username/email"
  errors?: Record<string, string[]>;
}
