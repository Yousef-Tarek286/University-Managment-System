// =================================================================
// types/course.ts — TypeScript Interfaces for Courses & Semesters
//
// Why define interfaces?
// TypeScript checks that our frontend code uses the exact same
// property names that our Express backend sends in JSON.
// =================================================================

export interface CourseDoctor {
  id: number;
  fullName: string;
  email: string;
}

export interface Semester {
  id: number;
  name: string;
  isActive: boolean;
  registrationOpen: boolean;
}

export interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  description: string | null;
  capacity: number;
  enrolledCount: number;
  remainingSeats: number;
  status: "ACTIVE" | "ARCHIVED";
  doctor: CourseDoctor | null;
  semester: Semester | null;
}

export interface EnrolledCourse extends Course {
  enrollmentId: number;
  enrollmentDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
