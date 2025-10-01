export interface GetMyLikesParams {
  page?: number;
  limit?: number;
}
export interface Author {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}
export interface PostLikeByMe {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likedAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  author: Author;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetMyLikesSuccessResponse {
  success: true;
  message: string;
  data: { posts: PostLikeByMe[]; pagination: Pagination };
}
export interface GetMyLikesErrorResponse {
  success: false;
  message: string;
}
