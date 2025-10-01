export interface CreateCommentParams {
  text: string;
}
export interface CreateCommentAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}
export interface CreatedComment {
  id: number;
  text: string;
  createdAt: string;
  author: CreateCommentAuthor;
  isMine: boolean;
}
export interface CreateCommentSuccessResponse {
  success: true;
  message: string;
  data: CreatedComment;
}
export interface CreateCommentErrorResponse {
  success: false;
  message: string;
}
