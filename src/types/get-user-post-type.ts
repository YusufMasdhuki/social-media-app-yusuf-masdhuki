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
  isSaved?: boolean;
  likedByMe: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} // Response sukses

export interface UserPostsSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { posts: Post[]; pagination: Pagination };
} // Response error

export interface UserPostsErrorResponse {
  success: false;
  message: string; // "User not found" | "Network error"
}
