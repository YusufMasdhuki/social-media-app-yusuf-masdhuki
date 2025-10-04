export interface GetPostLikesParams {
  id: number; // post id (path param)
  page?: number;
  limit?: number;
}
export interface UserLike {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetPostLikesSuccessResponse {
  success: true;
  message: string;
  data: { users: UserLike[]; pagination: Pagination };
}
export interface GetPostLikesErrorResponse {
  success: false;
  message: string;
}
