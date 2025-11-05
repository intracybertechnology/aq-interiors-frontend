export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  path: string;
  size: number;
}
export interface SingleImageUploadResponse {
  filename: string;
  originalName: string;
  path: string;
  size: number;
}
export interface MultipleImagesUploadResponse {
  files: UploadedFileInfo[];
  count: number;
}
export interface UploadError {
  field?: string;
  message: string;
  code?: string;
}