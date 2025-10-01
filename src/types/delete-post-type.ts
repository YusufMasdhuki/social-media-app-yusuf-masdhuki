export interface DeletePostData {
  deleted: boolean;
}
export interface DeletePostSuccessResponse {
  success: true;
  message: string; // "Deleted"
  data: DeletePostData;
}
export interface DeletePostErrorResponse {
  success: false;
  message: string; // "Unauthorized" | "Forbidden" | "Not found" | "Network error"
}
