export interface FeedAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
}
export interface FeedItem {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: FeedAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}
export interface FeedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetFeedParams {
  page?: number;
  limit?: number;
}

export interface FeedData {
  items: FeedItem[];
  pagination: FeedPagination;
}
export interface GetFeedSuccessResponse {
  success: true;
  message: string;
  data: FeedData;
}
export interface GetFeedErrorResponse {
  success: false;
  message: string;
}
