export interface SavedPost {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface SavedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSavedPostsSuccessResponse {
  success: true;
  message: string;
  data: {
    posts: SavedPost[];
    pagination: SavedPagination;
  };
}

export interface GetSavedPostsErrorResponse {
  success: false;
  message: string;
}

export interface GetSavedPostsParams {
  page?: number;
  limit?: number;
}
