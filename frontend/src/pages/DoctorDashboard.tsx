import MainLayout from "../components/layout/MainLayout";
import Card from "../components/layout/common/Card";
import AnnouncementFeed from "../components/announcements/AnnouncementFeed";
import { useAuth } from "../context/AuthContext";

function DoctorDashboard() {
  const { user } = useAuth();
  const username = user?.fullName || "Doctor";

  return (
    <MainLayout role="DOCTOR" username={username}>
      <div
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.65), rgba(79, 70, 229, 0.7)), linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)',
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          color: "#ffffff",
          boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "30px", color: "#ffffff" }}>
          Welcome, {username}
        </h1>
        <p style={{ margin: 0, fontSize: "15px", opacity: 0.9 }}>
          Overview of your assigned courses and recent announcements.
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
        <Card title="Assigned Courses">
          <h2 style={{ color: "#4f46e5", margin: "0 0 6px 0" }}>3 Courses</h2>
          <p style={{ margin: 0 }}>Fall 2026 semester.</p>
        </Card>

        <Card title="Total Students">
          <h2 style={{ color: "#2563eb", margin: "0 0 6px 0" }}>120 Students</h2>
          <p style={{ margin: 0 }}>Enrolled across your classes.</p>
        </Card>

        <Card title="Uploaded Materials">
          <h2 style={{ color: "#10b981", margin: "0 0 6px 0" }}>18 Files</h2>
          <p style={{ margin: 0 }}>Lecture slides and PDFs.</p>
        </Card>
      </div>

      <h2 style={{ marginBottom: "14px" }}>Recent Announcements</h2>
      <AnnouncementFeed />
    </MainLayout>
  );
}

export default DoctorDashboard;
