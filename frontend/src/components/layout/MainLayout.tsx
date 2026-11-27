
import { useState } from "react";
import "./MainLayout.css";

type UserRole = "STUDENT" | "DOCTOR" | "ADMIN";

interface MainLayoutProps {
  role: UserRole;
  username: string;
  children: React.ReactNode;
}

function MainLayout({ role, username, children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navLinks = {
    STUDENT: ["Dashboard", "Courses", "Schedule"],
    DOCTOR: ["Dashboard", "My Courses"],
    ADMIN: ["Dashboard", "Users", "Courses"],
  };

  return (
    <div className="main-layout">
      <header className="navbar">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <h2>University Portal</h2>

        <div className="user-info">
          <span>{username}</span>
          <button>Logout</button>
        </div>
      </header>

      <div className="layout-body">
        {sidebarOpen && (
          <aside className="sidebar">
            <h3>{role}</h3>

            <nav>
              {navLinks[role].map((link) => (
                <div key={link} className="nav-link">
                  {link}
                </div>
              ))}
            </nav>
          </aside>
        )}

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
