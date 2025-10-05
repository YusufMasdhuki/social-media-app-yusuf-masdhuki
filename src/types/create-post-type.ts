export interface CreatePostRequest {
  image: File; // file JPG/PNG/WEBP (max 5MB)
  caption: string;
}

export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface CreatePostSuccessResponse {
  success: true;
  message: string; // "Created"
  data: Post;
}

export interface CreatePostErrorResponse {
  success: false;
  message: string; // "Bad Request" | "Unauthorized" | "Network error"
}
