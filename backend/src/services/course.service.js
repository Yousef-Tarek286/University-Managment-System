// =================================================================
// services/course.service.js — Business Logic for Courses
//
// Services handle database queries and business rules.
// Controllers stay thin and simply pass HTTP input here.
// =================================================================

const prisma = require("../config/prisma");

/**
 * Retrieves all ACTIVE courses, with optional search and semester filters.
 * @param {Object} filters
 * @param {string} [filters.search] - Search text matching courseName or courseCode
 * @param {number} [filters.semesterId] - Filter by specific semester ID
 */
const getAvailableCourses = async ({ search, semesterId } = {}) => {
  // Build the dynamic "where" filter object for Prisma
  const where = {
    status: "ACTIVE", // Business Rule: Archived courses must not appear for browsing
  };

  if (semesterId) {
    where.semesterId = Number(semesterId);
  }

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { courseName: { contains: term, mode: "insensitive" } },
      { courseCode: { contains: term, mode: "insensitive" } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
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
    orderBy: { courseCode: "asc" },
  });

  // Format each course cleanly so the frontend gets enrolledCount directly
  return courses.map((course) => ({
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

/**
 * Retrieves all semesters so the frontend can populate the filter dropdown.
 */
const getSemesters = async () => {
  return prisma.semester.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      name: true,
      isActive: true,
      registrationOpen: true,
    },
  });
};

module.exports = {
  getAvailableCourses,
  getSemesters,
};

