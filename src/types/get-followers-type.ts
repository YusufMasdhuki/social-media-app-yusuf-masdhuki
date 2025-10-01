export interface GetFollowersParams {
  username: string;
  page?: number;
  limit?: number;
}
export interface FollowerUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowedByMe: boolean;
}
export interface FollowersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetFollowersSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { users: FollowerUser[]; pagination: FollowersPagination };
}
export interface GetFollowersErrorResponse {
  success: false;
  message: string;
}
