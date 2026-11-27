

import "./../App.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  };

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
    setError("");
  };

  // Display welcome screen after login
  if (user) {
    return (
      <div className="container">
        <header>
          <h1>Welcome {user.fullName}</h1>
          <p>Your role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </header>
      </div>
    );
  }

  // Display login form
  return (
    <div className="container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>University Management System</h1>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
