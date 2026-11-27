
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AvailableCoursesPage } from "./pages/AvailableCoursesPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<AvailableCoursesPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

