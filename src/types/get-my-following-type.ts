export interface GetMyFollowingParams {
  page?: number;
  limit?: number;
}
export interface MyFollowingUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
export interface MyFollowingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetMyFollowingSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { users: MyFollowingUser[]; pagination: MyFollowingPagination };
}
export interface GetMyFollowingErrorResponse {
  success: false;
  message: string;
}
