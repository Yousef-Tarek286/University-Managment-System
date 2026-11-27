import prisma from "../config/prisma.js";

/**
 * Retrieves all ACTIVE courses, with optional search and semester filters.
 */
const getAvailableCourses = async ({ search, semesterId } = {}) => {
  const where = {
    status: "ACTIVE",
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

  return courses.map((course) => ({
    id: course.id,
    courseName: course.courseName,
    courseCode: course.courseCode,
    description: course.description,
    capacity: course.capacity,
    enrolledCount: course._count.enrollments,
    remainingSeats: Math.max(
      0,
      course.capacity - course._count.enrollments
    ),
    status: course.status,
    doctor: course.doctor,
    semester: course.semester,
  }));
};

/**
 * Retrieves all semesters for the frontend filter dropdown.
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

export default {
  getAvailableCourses,
  getSemesters,
};

