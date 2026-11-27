import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/layout/common/Card";
import MaterialList from "../components/materials/MaterialList";
import AnnouncementFeed from "../components/announcements/AnnouncementFeed";
import Modal from "../components/layout/common/Modal";
import Button from "../components/layout/common/Button";
import LoadingSpinner from "../components/layout/common/LoadingSpinner";
import "./CourseDetailsPage.css";

type TabKey = "materials" | "announcements" | "quizzes" | "participants";

function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("materials");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceContent, setAnnounceContent] = useState("");
  const [announceType, setAnnounceType] = useState<"general" | "important" | "quiz">("general");
  const [announceRefreshKey, setAnnounceRefreshKey] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!uploadStatus) return;
    const timer = setTimeout(() => setUploadStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [uploadStatus]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/api/courses/1/materials", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSelectedFile(null);
        setIsUploadOpen(false);
        setRefreshKey((k) => k + 1);
        setUploadStatus({ type: "success", text: "Upload successful" });
      } else {
        setIsUploadOpen(false);
        setUploadStatus({ type: "error", text: "Upload failed" });
      }
    } catch {
      setIsUploadOpen(false);
      setUploadStatus({ type: "error", text: "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout role="STUDENT" username="Mohamed">
      {uploadStatus && (
        <div
          className={`status-banner ${uploadStatus.type}`}
        >
          <div className="status-banner-content">
            <span className="material-symbols-outlined">
              {uploadStatus.type === "success" ? "check" : "close"}
            </span>
            <span>{uploadStatus.text}</span>
          </div>
          <div className="status-timer-bar" />
        </div>
      )}

      <div className="course-header">
        <h1>CS101 - Introduction to Computer Science</h1>
        <p>Instructor: Dr. Ahmed Hassan • Fall 2026</p>
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
          <div style={{ marginBottom: "16px" }}>
            <Button variant="primary" onClick={() => setIsUploadOpen(true)}>
              Upload Material
            </Button>
          </div>

          <MaterialList courseId={1} refreshKey={refreshKey} />

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

              <p>Select a PDF or PowerPoint file to share with your students.</p>

              <label className="btn btn-secondary">
                Choose File
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  style={{ display: "none" }}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
        </>
      )}

      {activeTab === "announcements" && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <Button variant="primary" onClick={() => setIsAnnounceOpen(true)}>
              New Announcement
            </Button>
          </div>

          <AnnouncementFeed courseId={1} refreshKey={announceRefreshKey} />

          <Modal
            title="New Announcement"
            isOpen={isAnnounceOpen}
            onClose={() => setIsAnnounceOpen(false)}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <select
                value={announceType}
                onChange={(e) =>
                  setAnnounceType(
                    e.target.value as "general" | "important" | "quiz"
                  )
                }
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                }}
              >
                <option value="general">General Announcement</option>
                <option value="important">Important / Urgent</option>
                <option value="quiz">Quiz / Exam</option>
              </select>

              <input
                type="text"
                placeholder="Announcement title"
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                }}
              />
              <textarea
                placeholder="Write your announcement..."
                rows={4}
                value={announceContent}
                onChange={(e) => setAnnounceContent(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
              <Button
                variant="primary"
                disabled={!announceTitle.trim() || !announceContent.trim()}
                onClick={async () => {
                  const prefix =
                    announceType === "important"
                      ? "[Important] "
                      : announceType === "quiz"
                        ? "[Quiz] "
                        : "";

                  const res = await fetch(
                    "http://localhost:3000/api/announcements",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: `${prefix}${announceTitle}`,
                        content: announceContent,
                        courseId: 1,
                      }),
                    }
                  );
                  if (res.ok) {
                    setAnnounceTitle("");
                    setAnnounceContent("");
                    setAnnounceType("general");
                    setIsAnnounceOpen(false);
                    setAnnounceRefreshKey((k) => k + 1);
                  }
                }}
              >
                Post Announcement
              </Button>
            </div>
          </Modal>
        </>
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
    </MainLayout>
  );
}

export default CourseDetailsPage;