
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState<{
    message: string;
    role: string;
  } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Restore logged-in user when the application loads
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Could not restore user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Handle login
  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("1. Sending login request...");

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("2. Response received:", response.status);

      const data = await response.json();
      console.log("3. Response data:", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save user information
      localStorage.setItem("user", JSON.stringify(data));

      // Update React state
      setUser(data);

    } catch (error) {
      console.error("Could not connect to backend:", error);
      alert("Could not connect to the server.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // Display logged-in screen
  if (user) {
    return (
      <div>
        <h1>{user.message}</h1>
        <p>Your role: {user.role}</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  // Display login form
  return (
    <div className="container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>University Management System</h1>

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

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default App;


