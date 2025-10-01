// Request param
export interface LikePostParams {
  id: number; // id post
}

// Success response
export interface LikePostSuccessResponse {
  success: true;
  message: string; // "Liked"
  data: {
    liked: boolean; // true kalau sudah like, false kalau unlike
    likeCount: number;
  };
}

// Error response
export interface LikePostErrorResponse {
  success: false;
  message: string; // error message
}

export interface UnlikePostSuccessResponse {
  success: true;
  message: string; // "Unliked"
  data: {
    liked: boolean; // false
    likeCount: number;
  };
}

export interface UnlikePostErrorResponse {
  success: false;
  message: string; // error message dari API
}
