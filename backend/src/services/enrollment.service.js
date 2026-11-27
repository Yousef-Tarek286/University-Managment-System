// =================================================================
// services/enrollment.service.js — Student Registration Logic
//
// Implements STU-03, STU-04, and Business Rules 5.2:
//   - Row-level locking (FOR UPDATE) inside a Prisma transaction
//     prevents concurrent registrations from exceeding capacity.
//   - Verifies course exists, is ACTIVE, registration is open,
//     student is not already enrolled, and seats are available.
// =================================================================

const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

/**
 * Registers an authenticated, active student in a course.
 * @param {Object} params
 * @param {number} params.studentId - Verified from req.user.id
 * @param {number|string} params.courseId - Target course ID from request body
 */
const registerForCourse = async ({ studentId, courseId }) => {
  const parsedCourseId = Number(courseId);
  if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
    throw new AppError("A valid courseId is required", 400);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Lock the Course row so concurrent enrollment requests serialize cleanly
    const lockedCourses = await tx.$queryRaw`
      SELECT id, "courseName", "courseCode", capacity, status, "semesterId"
      FROM "Course"
      WHERE id = ${parsedCourseId}
      FOR UPDATE
    `;

    const course = lockedCourses[0];
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // 2. Archived courses cannot accept new registrations
    if (course.status !== "ACTIVE") {
      throw new AppError("This course is archived and not open for registration", 400);
    }

    // 3. Verify registration period is open for the course's semester
    if (!course.semesterId) {
      throw new AppError("This course is not assigned to an active semester", 400);
    }

    const semester = await tx.semester.findUnique({
      where: { id: course.semesterId },
      select: { id: true, name: true, registrationOpen: true },
    });

    if (!semester || !semester.registrationOpen) {
      throw new AppError("Course registration period is currently closed", 400);
    }

    // 4. Prevent duplicate enrollments (respecting @@unique([studentId, courseId]))
    const existing = await tx.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: parsedCourseId,
        },
      },
    });

    if (existing) {
      if (existing.status === "ENROLLED") {
        throw new AppError("You are already enrolled in this course", 409);
      }
      if (existing.status === "COMPLETED") {
        throw new AppError("You have already completed this course", 400);
      }
    }

    // 5. Enforce maximum capacity
    const currentEnrolledCount = await tx.enrollment.count({
      where: {
        courseId: parsedCourseId,
        status: "ENROLLED",
      },
    });

    if (currentEnrolledCount >= course.capacity) {
      throw new AppError("This course has reached maximum capacity", 409);
    }

    // 6. Create new enrollment or reactivate a previously DROPPED record
    const enrollment = existing
      ? await tx.enrollment.update({
          where: { id: existing.id },
          data: {
            status: "ENROLLED",
            enrollmentDate: new Date(),
          },
          include: {
            course: {
              select: {
                id: true,
                courseCode: true,
                courseName: true,
                capacity: true,
              },
            },
          },
        })
      : await tx.enrollment.create({
          data: {
            studentId,
            courseId: parsedCourseId,
            status: "ENROLLED",
          },
          include: {
            course: {
              select: {
                id: true,
                courseCode: true,
                courseName: true,
                capacity: true,
              },
            },
          },
        });

    const newEnrolledCount = currentEnrolledCount + 1;

    return {
      enrollmentId: enrollment.id,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate,
      course: {
        ...enrollment.course,
        enrolledCount: newEnrolledCount,
        remainingSeats: Math.max(0, course.capacity - newEnrolledCount),
      },
    };
  });
};

/**
 * Retrieves all ENROLLED courses for the authenticated student.
 * Formatted to stay compatible with CourseCard and course.service.js.
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

/**
 * Allows a student to drop an active enrollment while registration is open.
 * Marks status as DROPPED instead of deleting historical records.
 */
const dropCourse = async ({ enrollmentId, studentId }) => {
  const parsedEnrollmentId = Number(enrollmentId);
  if (!Number.isInteger(parsedEnrollmentId) || parsedEnrollmentId <= 0) {
    throw new AppError("A valid enrollment ID is required", 400);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: parsedEnrollmentId },
    include: {
      course: {
        include: {
          semester: {
            select: { registrationOpen: true },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new AppError("Enrollment record not found", 404);
  }

  if (enrollment.studentId !== studentId) {
    throw new AppError("You are not authorized to drop this enrollment", 403);
  }

  if (enrollment.status !== "ENROLLED") {
    throw new AppError("Only active enrollments can be dropped", 400);
  }

  if (!enrollment.course?.semester?.registrationOpen) {
    throw new AppError(
      "Cannot drop a course when the registration period is closed",
      400
    );
  }

  const updated = await prisma.enrollment.update({
    where: { id: parsedEnrollmentId },
    data: { status: "DROPPED" },
    select: {
      id: true,
      courseId: true,
      status: true,
    },
  });

  return updated;
};

module.exports = {
  registerForCourse,
  getMyCourses,
  dropCourse,
};
