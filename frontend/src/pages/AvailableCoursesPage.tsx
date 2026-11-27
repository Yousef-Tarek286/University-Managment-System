// =================================================================
// pages/AvailableCoursesPage.tsx — Course Browsing & Catalog (STU-02)
//
// Features:
//   - Fetches active courses and semesters from the Express API
//   - Live search by course code or course name
//   - Filter dropdown by academic semester
//   - Loading, error, and empty states
// =================================================================

import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { getAvailableCourses, getSemesters } from "../services/courseService";
import type { Course, Semester } from "../types/course";
import "./AvailableCoursesPage.css";

export function AvailableCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load semesters once when the page first mounts
  useEffect(() => {
    getSemesters()
      .then((data) => setSemesters(data))
      .catch((err) => console.error("Failed to load semesters:", err));
  }, []);

  // Re-fetch courses whenever search or selectedSemester changes
  useEffect(() => {
    let isCancelled = false;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAvailableCourses({
          search,
          semesterId: selectedSemester,
        });
        if (!isCancelled) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
        if (!isCancelled) {
          setError(
            "Unable to load courses. Make sure the backend server is running on port 3000."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    // Small 250ms debounce so typing doesn't fire a request on every keystroke
    const timer = setTimeout(fetchCourses, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, selectedSemester]);

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <div>
          <h1>Available Courses</h1>
          <p>Browse active university courses, instructors, and seat availability.</p>
        </div>
        <span className="course-count-pill">
          {courses.length} {courses.length === 1 ? "Course" : "Courses"}
        </span>
      </header>

      <section className="catalog-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by course code or name (e.g. CS101, Database)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="semester-select"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">All Semesters</option>
          {semesters.map((sem) => (
            <option key={sem.id} value={String(sem.id)}>
              {sem.name}
            </option>
          ))}
        </select>
      </section>

      {error && <div className="catalog-error">{error}</div>}

      {isLoading ? (
        <div className="catalog-state">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="catalog-state">
          No courses match your current search or semester filter.
        </div>
      ) : (
        <section className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      )}
    </div>
  );
}
