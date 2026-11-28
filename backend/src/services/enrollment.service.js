// =================================================================
// services/enrollment.service.js — Student Enrolled Courses Logic
//
// Implements STU-04 (View Enrolled Courses):
//   - Queries PostgreSQL via Prisma for all ENROLLED courses
//     belonging to the authenticated student.
//   - Returns course metadata, instructor, semester, and seat counts.
// =================================================================

import prisma from "../config/prisma.js";

/**
 * Retrieves all ENROLLED courses for the authenticated student.
 * @param {number} studentId - Verified from req.user.id
 */
const getMyCourses = async (studentId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      status: "ENROLLED",
    },
    include: {
      course: {
        include: {
          doctor: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          semester: {
            select: {
              id: true,
              name: true,
              isActive: true,
              registrationOpen: true,
            },
          },
          _count: {
            select: {
              enrollments: {
                where: { status: "ENROLLED" },
              },
            },
          },
        },
      },
    },
    orderBy: { enrollmentDate: "desc" },
  });

  return enrollments.map(({ id: enrollmentId, enrollmentDate, course }) => ({
    enrollmentId,
    enrollmentDate,
    id: course.id,
    courseName: course.courseName,
    courseCode: course.courseCode,
    description: course.description,
    capacity: course.capacity,
    enrolledCount: course._count.enrollments,
    remainingSeats: Math.max(0, course.capacity - course._count.enrollments),
    status: course.status,
    doctor: course.doctor,
    semester: course.semester,
  }));
};

export { getMyCourses };
