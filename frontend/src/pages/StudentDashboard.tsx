import MainLayout from "../components/layout/MainLayout";
import Card from "../components/layout/common/Card";
import AnnouncementFeed from "../components/announcements/AnnouncementFeed";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();
  const username = user?.fullName || "Student";

  return (
    <MainLayout role="STUDENT" username={username}>
      <div
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(37, 99, 235, 0.65)), linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0ea5e9 100%)',
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          color: "#ffffff",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "30px", color: "#ffffff" }}>
          Welcome, {username}
        </h1>
        <p style={{ margin: 0, fontSize: "15px", opacity: 0.9 }}>
          Here is a summary of your enrolled courses and latest announcements.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <Card title="Enrolled Courses">
          <h2 style={{ color: "#2563eb", margin: "0 0 6px 0" }}>4 Courses</h2>
          <p style={{ margin: 0 }}>Active this semester.</p>
        </Card>

        <Card title="Pending Assignments">
          <h2 style={{ color: "#f59e0b", margin: "0 0 6px 0" }}>3 Pending</h2>
          <p style={{ margin: 0 }}>Check your course tabs for details.</p>
        </Card>

        <Card title="Upcoming Quizzes">
          <h2 style={{ color: "#10b981", margin: "0 0 6px 0" }}>1 Quiz</h2>
          <p style={{ margin: 0 }}>Scheduled for this week.</p>
        </Card>
      </div>

      <h2 style={{ marginBottom: "14px" }}>Latest Announcements</h2>
      <AnnouncementFeed />
    </MainLayout>
  );
}

export default StudentDashboard;
