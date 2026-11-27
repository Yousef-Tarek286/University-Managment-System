import Button from "./components/layout/common/Button";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <MainLayout role="STUDENT" username="Mohamed">
      <h1>Student Dashboard</h1>
      <p>Welcome to your University Portal!</p>

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