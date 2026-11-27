export interface CourseMaterial {
  id: number;
  title: string;
  description: string | null;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  courseId: number;
  uploadedById: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialDownloadData {
  downloadUrl: string;
  fileName: string;
}
