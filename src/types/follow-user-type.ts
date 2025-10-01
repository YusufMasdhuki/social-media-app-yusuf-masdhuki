export interface FollowUserParams {
  username: string;
}

// Response sukses
export interface FollowUserSuccessResponse {
  success: true;
  message: string; // "Now following"
  data: {
    following: boolean;
  };
}

// Response error
export interface FollowUserErrorResponse {
  success: false;
  message: string; // "Cannot follow yourself" | "User not found" | dll
}

export interface UnfollowUserParams {
  username: string;
}
export interface UnfollowUserSuccessResponse {
  success: true;
  message: string; // "Unfollowed"
  data: { following: false };
}
export interface UnfollowUserErrorResponse {
  success: false;
  message: string;
}
