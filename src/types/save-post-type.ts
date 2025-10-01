export interface SavePostParams {
  id: number; // post ID
}
export interface SavePostSuccessResponse {
  success: true;
  message: string; // "Saved"
  data: {
    saved: boolean; // true jika tersimpan, false jika unsave
  };
}
export interface SavePostErrorResponse {
  success: false;
  message: string;
}
