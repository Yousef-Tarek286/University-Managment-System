import Button from "./components/layout/common/Button";
import MainLayout from "./components/layout/MainLayout";
import Card from "./components/layout/common/Card";
function App() {
  return (
    <MainLayout role="STUDENT" username="Mohamed">
      <h1>Student Dashboard</h1>
      <p>Welcome to your University Portal!</p>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "25px" }}>

  <Card title="My Courses">
    <h2 style={{ color: "#2563eb" }}>4 Courses</h2>
    <p>You are currently enrolled in 4 courses.</p>
  </Card>

  <Card title="Assignments">
    <h2 style={{ color: "#f78c00" }}>3 Pending</h2>
    <p>You have 3 assignments to complete.</p>
  </Card>

  <Card title="Announcements">
    <h2 style={{ color: "#ff0000" }}>2 New</h2>
    <p>You have 2 new course announcements.</p>
  </Card>

</div>

      <Button variant="primary" onClick={() => alert("Save clicked!")}>
        Save
      </Button>

      <Button variant="secondary" onClick={() => alert("Cancel clicked!")}>
        Cancel
      </Button>

      <Button variant="danger" onClick={() => alert("Delete clicked!")}>
        Delete
      </Button>

    </MainLayout>
  );
}

export default App;