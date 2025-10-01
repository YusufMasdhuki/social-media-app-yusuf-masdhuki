export interface PostDetail {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}
export interface GetPostByIdSuccessResponse {
  success: true;
  message: string; // "OK"
  data: PostDetail;
}
export interface GetPostByIdErrorResponse {
  success: false;
  message: string; // "Not found" | "Network error"
}
