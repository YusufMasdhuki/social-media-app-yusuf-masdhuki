export interface DeleteCommentSuccessResponse {
  success: true;
  message: string;
  data: {
    deleted: boolean;
  };
}

export interface DeleteCommentErrorResponse {
  success: false;
  message: string;
}
