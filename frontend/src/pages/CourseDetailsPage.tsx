import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/layout/common/Card";
import MaterialList from "../components/materials/MaterialList";
import Modal from "../components/layout/common/Modal";
import Button from "../components/layout/common/Button";
import LoadingSpinner from "../components/layout/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import type { Course } from "../types/course";
import {
  getCourseById,
  uploadCourseMaterial,
} from "../services/materialService";
import "./CourseDetailsPage.css";

type TabKey = "materials" | "announcements" | "quizzes" | "participants";
type UserRole = "STUDENT" | "DOCTOR" | "ADMIN";

function normalizeRole(role?: string): UserRole {
  if (role === "DOCTOR" || role === "ADMIN" || role === "STUDENT") {
    return role;
  }
  return "STUDENT";
}

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const { user } = useAuth();

  const role = normalizeRole(user?.role);
  const username = user?.fullName || "Guest";
  const canManageMaterials = role === "DOCTOR" || role === "ADMIN";

  const [course, setCourse] = useState<Course | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("materials");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!Number.isInteger(courseId) || courseId <= 0) {
      setCourseError("Invalid course ID.");
      setCourseLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setCourseLoading(true);
        setCourseError(null);
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load course details."
          : "Failed to load course details.";
        setCourseError(message);
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (!uploadStatus) return;
    const timer = setTimeout(() => setUploadStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [uploadStatus]);

  const handleUpload = async () => {
    if (!selectedFile || !Number.isInteger(courseId) || courseId <= 0) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      await uploadCourseMaterial(courseId, selectedFile);
      setSelectedFile(null);
      setIsUploadOpen(false);
      setRefreshKey((k) => k + 1);
      setUploadStatus({ type: "success", text: "Upload successful" });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Upload failed"
        : "Upload failed";
      setIsUploadOpen(false);
      setUploadStatus({ type: "error", text: message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout role={role} username={username}>
      {uploadStatus && (
        <div className={`status-banner ${uploadStatus.type}`}>
          <div className="status-banner-content">
            <span className="material-symbols-outlined">
              {uploadStatus.type === "success" ? "check" : "close"}
            </span>
            <span>{uploadStatus.text}</span>
          </div>
          <div className="status-timer-bar" />
        </div>
      )}

      {courseLoading ? (
        <LoadingSpinner message="Loading course details..." />
      ) : courseError || !course ? (
        <Card title="Course Not Found">
          <p style={{ color: "#dc2626", margin: 0 }}>
            {courseError || "Unable to load this course."}
          </p>
        </Card>
      ) : (
        <>
          <div className="course-header">
            <h1>
              {course.courseCode} - {course.courseName}
            </h1>
            <p>
              Instructor: {course.doctor?.fullName || "Unassigned"}
              {course.semester ? ` • ${course.semester.name}` : ""}
            </p>
          </div>

          <div className="course-tabs">
            <button
              className={activeTab === "materials" ? "tab active" : "tab"}
              onClick={() => setActiveTab("materials")}
            >
              <span className="material-symbols-outlined">menu_book</span>
              Materials
            </button>

            <button
              className={activeTab === "announcements" ? "tab active" : "tab"}
              onClick={() => setActiveTab("announcements")}
            >
              <span className="material-symbols-outlined">assignment</span>
              Announcements
            </button>

            <button
              className={activeTab === "quizzes" ? "tab active" : "tab"}
              onClick={() => setActiveTab("quizzes")}
            >
              <span className="material-symbols-outlined">quiz</span>
              Quizzes
            </button>

            <button
              className={activeTab === "participants" ? "tab active" : "tab"}
              onClick={() => setActiveTab("participants")}
            >
              <span className="material-symbols-outlined">group</span>
              Participants
            </button>
          </div>

          {activeTab === "materials" && (
            <>
              {canManageMaterials && (
                <div style={{ marginBottom: "16px" }}>
                  <Button
                    variant="primary"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    Upload Material
                  </Button>
                </div>
              )}

              <MaterialList
                courseId={course.id}
                refreshKey={refreshKey}
                canManage={canManageMaterials}
              />

              {canManageMaterials && (
                <Modal
                  title="Upload Material"
                  isOpen={isUploadOpen}
                  onClose={() => setIsUploadOpen(false)}
                >
                  <div className="upload-area">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "55px",
                        color: "#2563eb",
                        marginBottom: "12px",
                      }}
                    >
                      upload_file
                    </span>

                    <p>
                      Select a PDF or PowerPoint file to share with your
                      students.
                    </p>

                    <label className="btn btn-secondary">
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    {selectedFile && (
                      <div className="selected-file">
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: "28px",
                              color: selectedFile.name.endsWith(".pdf")
                                ? "#dc2626"
                                : "#ea580c",
                            }}
                          >
                            {selectedFile.name.endsWith(".pdf")
                              ? "picture_as_pdf"
                              : "slideshow"}
                          </span>
                          {selectedFile.name}
                        </span>

                        <Button
                          variant="danger"
                          onClick={() => setSelectedFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}

                    {isUploading && (
                      <div style={{ marginTop: "12px" }}>
                        <LoadingSpinner message="Uploading..." />
                      </div>
                    )}

                    <Button
                      variant="primary"
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                </Modal>
              )}
            </>
          )}

          {activeTab === "announcements" && (
            <Card title="Announcements">
              <p>Course announcements will appear here.</p>
            </Card>
          )}

          {activeTab === "quizzes" && (
            <Card title="Quizzes">
              <p>Quizzes will be available in Phase 2.</p>
            </Card>
          )}

          {activeTab === "participants" && (
            <Card title="Participants">
              <p>Enrolled students and course instructors will appear here.</p>
            </Card>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default CourseDetailsPage;
