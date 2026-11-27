import api from "./api";
import type { ApiResponse, Course } from "../types/course";
import type { CourseMaterial, MaterialDownloadData } from "../types/material";

export async function getCourseById(courseId: number): Promise<Course> {
  const response = await api.get<ApiResponse<Course>>(`/courses/${courseId}`);
  return response.data.data;
}

export async function getCourseMaterials(
  courseId: number
): Promise<CourseMaterial[]> {
  const response = await api.get<ApiResponse<CourseMaterial[]>>(
    `/courses/${courseId}/materials`
  );
  return response.data.data;
}

export async function uploadCourseMaterial(
  courseId: number,
  file: File,
  title?: string,
  description?: string
): Promise<CourseMaterial> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);

  const response = await api.post<ApiResponse<CourseMaterial>>(
    `/courses/${courseId}/materials`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
}

export async function getMaterialDownloadUrl(
  materialId: number
): Promise<MaterialDownloadData> {
  const response = await api.get<ApiResponse<MaterialDownloadData>>(
    `/materials/${materialId}/download`
  );
  return response.data.data;
}

export async function deleteMaterial(materialId: number): Promise<void> {
  await api.delete<ApiResponse<null>>(`/materials/${materialId}`);
}
