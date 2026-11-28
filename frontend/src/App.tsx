import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { AvailableCoursesPage } from "./pages/AvailableCoursesPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import StudentDashboard from "./pages/StudentDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function DashboardRoute() {
  const { user } = useAuth();
  return user?.role === "DOCTOR" ? <DoctorDashboard /> : <StudentDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/courses" element={<AvailableCoursesPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
