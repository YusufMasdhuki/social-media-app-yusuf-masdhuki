export interface Post {
  id: number;
  imageUrl: string | null;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response sukses
export interface UserLikesSuccessResponse {
  success: true;
  message: string; // "OK"
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

// Response error
export interface UserLikesErrorResponse {
  success: false;
  message: string; // "User not found" | "Network error"
}
