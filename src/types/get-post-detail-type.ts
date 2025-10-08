export interface Author {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
}

export interface PostDetail {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author; // ✅ ditambahkan
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isSaved?: boolean;
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
