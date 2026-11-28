import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/layout/MainLayout";
import { CourseCard } from "../components/CourseCard";
import LoadingSpinner from "../components/layout/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getMyCourses } from "../services/enrollmentService";
import type { EnrolledCourse } from "../types/course";
import "./AvailableCoursesPage.css";

type UserRole = "STUDENT" | "DOCTOR" | "ADMIN";

function normalizeRole(role?: string): UserRole {
  if (role === "DOCTOR" || role === "ADMIN" || role === "STUDENT") {
    return role;
  }
  return "STUDENT";
}

export function MyCoursesPage() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const username = user?.fullName || "Guest";

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyCourses();
        setCourses(data);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load enrolled courses."
          : "Failed to load enrolled courses.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <MainLayout role={role} username={username}>
      <div className="catalog-page">
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">My Enrolled Courses</h1>
            <p className="catalog-subtitle">
              View the courses you are currently enrolled in for this semester.
            </p>
          </div>
          <Link
            to="/courses"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Browse Catalog
          </Link>
        </div>

        {loading && <LoadingSpinner message="Loading your enrolled courses..." />}

        {!loading && error && (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>No Enrolled Courses Yet</h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              You haven&apos;t enrolled in any courses yet. Browse the catalog to
              find available courses.
            </p>
            <Link
              to="/courses"
              className="btn btn-primary"
              style={{ textDecoration: "none" }}
            >
              Browse Available Courses
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.enrollmentId} course={course} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyCoursesPage;
