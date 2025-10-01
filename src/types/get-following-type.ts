export interface GetFollowingParams {
  username: string;
  page?: number;
  limit?: number;
}
export interface FollowingUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
export interface FollowingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetFollowingSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { users: FollowingUser[]; pagination: FollowingPagination };
}
export interface GetFollowingErrorResponse {
  success: false;
  message: string;
}
