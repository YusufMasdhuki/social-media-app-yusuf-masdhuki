export interface UnsavePostParams {
  id: number; // Post ID
}

export interface UnsavePostSuccessResponse {
  success: true;
  message: string; // "Unsaved"
  data: {
    saved: false; // setelah di-unsave pasti false
  };
}

export interface UnsavePostErrorResponse {
  success: false;
  message: string;
}
