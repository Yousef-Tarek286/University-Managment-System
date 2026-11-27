// =================================================================
// components/CourseCard.tsx — Polished Course Card
// =================================================================

import type { Course } from "../types/course";
import "./CourseCard.css";

interface CourseCardProps {
  course: Course;
}

function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function CourseCard({ course }: CourseCardProps) {
  const isFull = course.remainingSeats <= 0;
  const isRegistrationOpen = course.semester?.registrationOpen ?? false;
  const fillPercentage =
    course.capacity > 0
      ? Math.min(100, Math.round((course.enrolledCount / course.capacity) * 100))
      : 0;

  const doctorName = course.doctor ? course.doctor.fullName : "Unassigned";

  return (
    <article className="course-card">
      <div className="course-card-top">
        <div className="course-badges">
          <span className="course-code-badge">{course.courseCode}</span>
          {course.semester && (
            <span className="semester-badge">{course.semester.name}</span>
          )}
        </div>
        <span
          className={`status-pill ${
            isRegistrationOpen && !isFull ? "status-open" : "status-closed"
          }`}
        >
          <span className="status-dot" />
          {isFull ? "Full" : isRegistrationOpen ? "Open" : "Closed"}
        </span>
      </div>

      <div className="course-card-body">
        <h2 className="course-title">{course.courseName}</h2>
        <p className="course-description">
          {course.description || "No course description provided."}
        </p>
      </div>

      <div className="course-instructor">
        <div className="instructor-avatar" aria-hidden="true">
          {course.doctor ? getInitials(doctorName) : "?"}
        </div>
        <div className="instructor-info">
          <span className="instructor-label">Instructor</span>
          <span className="instructor-name">{doctorName}</span>
        </div>
      </div>

      <div className="capacity-section">
        <div className="capacity-text">
          <span className="capacity-ratio">
            <strong>{course.enrolledCount}</strong> / {course.capacity} enrolled
          </span>
          <span className={isFull ? "seats-full" : "seats-available"}>
            {isFull ? "No seats left" : `${course.remainingSeats} seats left`}
          </span>
        </div>
        <div className="capacity-bar-track">
          <div
            className={`capacity-bar-fill ${isFull ? "bar-full" : ""}`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>
    </article>
  );
}
