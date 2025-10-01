export interface GetPostCommentsParams {
  page?: number;
  limit?: number;
}
export interface CommentAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}
export interface PostComment {
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthor;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetPostCommentsSuccessResponse {
  success: true;
  message: string;
  data: { comments: PostComment[]; pagination: Pagination };
}
export interface GetPostCommentsErrorResponse {
  success: false;
  message: string;
}
