import api from "./api";
import type { ApiResponse, EnrolledCourse } from "../types/course";

export async function getMyCourses(): Promise<EnrolledCourse[]> {
  const response = await api.get<ApiResponse<EnrolledCourse[]>>(
    "/enrollments/my-courses"
  );
  return response.data.data;
}
