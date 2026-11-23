
import "./App.css";
import { useState } from "react";

function App() {
  const [user, setUser] = useState<{
    message: string;
    role: string;
  } | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          username,
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

      setUser(data);
    } catch (error) {
      console.error("Could not connect to backend:", error);
      alert("Could not connect to the server.");
    }
  };

  if (user) {
    return (
      <div>
        <h1>{user.message}</h1>
        <p>Your role: {user.role}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>University Management System</h1>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
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

export default App;

