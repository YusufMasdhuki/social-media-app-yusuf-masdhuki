export interface GetMyFollowersParams {
  page?: number;
  limit?: number;
}
export interface MyFollowerUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
export interface MyFollowersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetMyFollowersSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { users: MyFollowerUser[]; pagination: MyFollowersPagination };
}
export interface GetMyFollowersErrorResponse {
  success: false;
  message: string;
}
