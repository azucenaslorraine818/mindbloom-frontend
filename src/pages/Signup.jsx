import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "../lib/mindbloom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validatePassword = (pwd) => {
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    return {
      isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
    };
  };

  const passwordCheck = validatePassword(password);
  const allRequirementsMet = passwordCheck.isValid;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Password must meet all requirements.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // ✅ CALL EDGE FUNCTION TO SEND CONFIRMATION EMAIL
      try {
        await supabase.functions.invoke("send-confirmation-email", {
          body: {
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name || "there",
            verification_link: `${window.location.origin}/`,
            email_type: "welcome",
          },
        });
        console.log("✅ Confirmation email sent");
      } catch (emailError) {
        console.error("❌ Email send error:", emailError);
        // Don't block signup if email fails
      }

      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <Logo size={56} />
            <h1 className="auth-logo-title">MindBloom</h1>
          </div>
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check your email!</h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5 }}>
              We sent a confirmation link to <strong>{email}</strong>.
              Please verify your email address, then come back to log in.
            </p>
            <Link to="/" style={{ display: "inline-block", marginTop: 20 }}>
              <button className="auth-button">Go to Log In</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <Logo size={56} />
          <h1 className="auth-logo-title">MindBloom</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />

            {password && (
              <div style={{
                fontSize: "12px",
                marginTop: "6px",
                padding: "8px",
                backgroundColor: "#f8f7ff",
                borderRadius: "6px",
                border: "1px solid #e9d5ff",
              }}>
                <div style={{ color: passwordCheck.hasMinLength ? "#10b981" : "#999", marginBottom: "4px" }}>
                  {passwordCheck.hasMinLength ? "✓" : "○"} 8+ characters
                </div>
                <div style={{ color: passwordCheck.hasUppercase ? "#10b981" : "#999", marginBottom: "4px" }}>
                  {passwordCheck.hasUppercase ? "✓" : "○"} Uppercase letter
                </div>
                <div style={{ color: passwordCheck.hasLowercase ? "#10b981" : "#999", marginBottom: "4px" }}>
                  {passwordCheck.hasLowercase ? "✓" : "○"} Lowercase letter
                </div>
                <div style={{ color: passwordCheck.hasNumber ? "#10b981" : "#999", marginBottom: "4px" }}>
                  {passwordCheck.hasNumber ? "✓" : "○"} Number
                </div>
                <div style={{ color: passwordCheck.hasSpecial ? "#10b981" : "#999" }}>
                  {passwordCheck.hasSpecial ? "✓" : "○"} Special character
                </div>
              </div>
            )}
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !allRequirementsMet}
            style={{ opacity: !allRequirementsMet ? 0.5 : 1 }}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
}