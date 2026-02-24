import React, { useState } from "react";
import { storage } from "../storage";
import { Heart } from "lucide-react";

export const Auth = ({ onLogin }: { onLogin: (id: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    if (isLogin) {
      const res = await storage.login(username, password);
      if (res.error) setError(res.error);
      else if (res.id) onLogin(res.id);
    } else {
      const res = await storage.register(username, password);
      if (res.error) setError(res.error);
      else if (res.id) onLogin(res.id);
    }
  };

  return (
    <div
      className="p-4"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <Heart
            size={48}
            color="#FF4B4B"
            fill="#FF4B4B"
            style={{ margin: "0 auto 16px" }}
          />
          <h2>Welcome to Clique</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {isLogin ? "Login to your account" : "Create a new account"}
          </p>
        </div>

        {error && (
          <div
            style={{
              color: "#ff4b4b",
              background: "rgba(255, 75, 75, 0.1)",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: 24 }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
