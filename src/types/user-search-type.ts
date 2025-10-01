export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface UserSearchSuccessResponse {
  success: true;
  message: string; // "OK"
  data: { users: UserSearchResult[]; pagination: Pagination };
}
export interface UserSearchErrorResponse {
  success: false;
  message: string; // "User not found" | "Network error"
}
