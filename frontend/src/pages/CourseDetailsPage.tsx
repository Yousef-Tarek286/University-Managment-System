import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/layout/common/Card";
import "./CourseDetailsPage.css";

type TabKey = "materials" | "announcements" | "quizzes" | "participants";

function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("materials");

  return (
    <MainLayout role="STUDENT" username="Mohamed">
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
        <Card title="Course Materials">
          <p>Lecture slides and PDFs will appear here.</p>
        </Card>
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
    </MainLayout>
  );
}

export default CourseDetailsPage;