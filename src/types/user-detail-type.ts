export interface UserCounts {
  post: number;
  followers: number;
  following: number;
  likes: number;
}
export interface UserDetail {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string;
  counts: UserCounts;
  isFollowing: boolean;
  isMe: boolean;
}
export interface UserDetailSuccessResponse {
  success: true;
  message: string; // "OK"
  data: UserDetail;
}
export interface UserDetailErrorResponse {
  success: false;
  message: string; // "Not found" | "Network error"
}
