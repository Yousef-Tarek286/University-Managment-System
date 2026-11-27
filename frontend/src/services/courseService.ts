// =================================================================
// services/courseService.ts — API Calls for Courses & Semesters
//
// Keeps HTTP logic out of React components so components stay
// focused on UI rendering and user interaction.
// =================================================================

import api from "./api";
import type { ApiResponse, Course, Semester } from "../types/course";

export interface CourseFilters {
  search?: string;
  semesterId?: string;
}

/**
 * Fetches active courses from GET /api/courses with optional filters.
 */
export const getAvailableCourses = async (
  filters: CourseFilters = {}
): Promise<Course[]> => {
  const params: Record<string, string> = {};

  if (filters.search && filters.search.trim() !== "") {
    params.search = filters.search.trim();
  }
  if (filters.semesterId && filters.semesterId !== "") {
    params.semesterId = filters.semesterId;
  }

  const response = await api.get<ApiResponse<Course[]>>("/courses", { params });
  return response.data.data;
};

/**
 * Fetches all semesters from GET /api/courses/semesters for the filter dropdown.
 */
export const getSemesters = async (): Promise<Semester[]> => {
  const response = await api.get<ApiResponse<Semester[]>>("/courses/semesters");
  return response.data.data;
};
