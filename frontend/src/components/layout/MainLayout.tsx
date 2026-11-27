
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
      <button
  className="sidebar-toggle"
  onClick={() => setSidebarOpen(!sidebarOpen)}
  aria-label="Toggle sidebar"
>
  ☰
</button>

<div className="brand">
  <img
    src="unilogo.png"
    alt="University Logo"
    className="university-logo"
  />
  
</div>

        <div className="user-info">
          <span>{username}</span>
         <button onClick={() => alert("Logout functionality will be connected later!")}>
  Logout
</button>
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
