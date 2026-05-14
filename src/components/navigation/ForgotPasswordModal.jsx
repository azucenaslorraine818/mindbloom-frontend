/**
 * ForgotPasswordModal — drop-in replacement for the one inside Landing.jsx
 *
 * Key fixes vs the original:
 *  1. redirectTo uses window.location.origin so it works on any deployment
 *  2. Error is cleared when the user edits the email field
 *  3. "Back to Login" closes the modal cleanly after success
 *  4. Email field is auto-focused when the modal opens
 */
import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPasswordModal({ onClose }) {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const inputRef = useRef(null);

  // auto-focus the email input when modal mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (sbError) {
  if (sbError.status === 429) {
    setError(
      "Too many reset attempts. Please wait a few minutes before trying again."
    );
  } else {
    setError(sbError.message);
  }

  setLoading(false);
  return;
}



    setSent(true);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🔑</div>
        <h2 className="modal-title">Reset your password</h2>

        {sent ? (
          <>
            <p className="modal-subtitle" style={{ color: "#2a7d46", marginTop: 8 }}>
              ✓ Check your inbox! We sent a reset link to <strong>{email}</strong>.
              It may take a minute to arrive — check your spam folder if you don't see it.
            </p>
            <button
              className="auth-button"
              style={{ width: "100%", marginTop: 20 }}
              onClick={onClose}
            >
              Back to Login
            </button>
          </>
        ) : (
          <form onSubmit={handleSend} style={{ width: "100%" }}>
            <p className="modal-subtitle" style={{ marginTop: 8 }}>
              Enter your account email and we'll send you a link to reset your password.
            </p>

            <input
              ref={inputRef}
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="lp-input"
              style={{ width: "100%", marginTop: 16, boxSizing: "border-box" }}
              required
            />

            {error && (
              <p className="lp-error" style={{ marginTop: 8 }}>{error}</p>
            )}

            <button
              type="submit"
              className="auth-button"
              style={{ width: "100%", marginTop: 12 }}
              disabled={loading || !email}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>

            <button type="button" className="modal-decline" onClick={onClose}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}