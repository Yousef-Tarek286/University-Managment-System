import { useState, useEffect } from "react";
import "./MainLayout.css";

type UserRole = "STUDENT" | "DOCTOR" | "ADMIN";

interface MainLayoutProps {
  role: UserRole;
  username: string;
  children: React.ReactNode;
}

function MainLayout({ role, username, children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const navLinks: Record<UserRole, string[]> = {
    STUDENT: ["Dashboard", "Courses", "Schedule"],
    DOCTOR: ["Dashboard", "My Courses"],
    ADMIN: ["Dashboard", "Users", "Courses"],
  };

  return (
    <div className={`main-layout ${darkMode ? "dark" : ""}`}>
      <header className="navbar">
        <div className="navbar-left">
          <button
            className="icon-btn sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            ☰
          </button>

          <div className="brand">
            <img
              src="/unilogo.png"
              alt="University Logo"
              className="university-logo"
            />
            <span className="brand-title">UniPortal</span>
          </div>
        </div>

        <div className="user-info">
          <button
            className="icon-btn theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle night mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
          >
            <span className="material-symbols-outlined">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="user-badge">
            <span className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">{username}</span>
          </div>

          <button
            className="logout-btn"
            onClick={() => alert("Logout functionality will be connected later!")}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <div className="sidebar-role-badge">{role}</div>

          <nav className="sidebar-nav">
            {navLinks[role].map((link) => (
              <button
                key={link}
                className={`nav-link ${activeLink === link ? "active" : ""}`}
                onClick={() => setActiveLink(link)}
              >
                <span className="nav-dot" />
                <span>{link}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
