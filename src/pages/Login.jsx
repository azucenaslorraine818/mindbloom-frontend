import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "../lib/mindbloom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) navigate("/app");
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo-wrap">
          <Logo size={56} />
          <h1 className="auth-logo-title">MindBloom</h1>
          <p className="auth-subtitle">Your Daily Stress Journal</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          No account?{" "}
          <Link to="/signup">Create one</Link>
        </p>

      </div>
    </div>
  );
}