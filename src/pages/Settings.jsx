import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ── SVG icon helpers ───────────────────────────────────────────────
const Icon = {
  user: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  shield: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  lock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setSaving_]    = useState(true);
  const [saving, setSaving]      = useState(false);
  const [saveMsg, setSaveMsg]    = useState("");
  const [saveMsgType, setSaveMsgType] = useState("success");

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg,     setPasswordMsg]     = useState("");
  const [passwordError,   setPasswordError]   = useState("");

  const [emailNotifs,    setEmailNotifs]    = useState(true);
  const [reminderNotifs, setReminderNotifs] = useState(true);

  // Emergency contact
  const [emergencyName,   setEmergencyName]   = useState("");
  const [emergencyEmail,  setEmergencyEmail]  = useState("");
  const [emergencyAlerts, setEmergencyAlerts] = useState(false);

  // Test-email state
  const [sendingTest,  setSendingTest]  = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setSaving_(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setSaving_(false); return; }
      setEmail(user.email || "");

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();

      if (profileData) {
        setName(profileData.name || profileData.full_name || "");
        setEmailNotifs(profileData.email_notifs ?? true);
        setReminderNotifs(profileData.reminder_notifs ?? true);
        setEmergencyName(profileData.emergency_contact_name  || "");
        setEmergencyEmail(profileData.emergency_contact_email || "");
        setEmergencyAlerts(profileData.emergency_alerts ?? false);
      }
      setSaving_(false);
    };
    fetchProfile();
  }, []);

  // ── Save profile ──────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from("profiles").update({
      email_notifs:            emailNotifs,
      reminder_notifs:         reminderNotifs,
      emergency_contact_name:  emergencyName,
      emergency_contact_email: emergencyEmail,
      emergency_alerts:        emergencyAlerts,
    }).eq("id", user.id);

    setSaving(false);
    if (error) {
      setSaveMsg("Failed to save. Please try again.");
      setSaveMsgType("error");
    } else {
      setSaveMsg("Saved successfully.");
      setSaveMsgType("success");
    }
    setTimeout(() => setSaveMsg(""), 3000);
  };

  // ── Send emergency alert ──────────────────────────────────────────
  const sendEmergencyEmail = async ({ message, score }) => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    if (!user_id) return { ok: false, reason: "Not logged in" };

    try {
      const { data, error } = await supabase.functions.invoke("send-emergency-email", {
        body: { user_id, message, score },
      });

      if (error) {
        // FunctionsHttpError — extract the real body from the Edge Function response
        let reason = error.message;
        try {
          const body = await error.context?.json();
          console.error("Edge Function error body:", JSON.stringify(body, null, 2));
          // Show the most specific message available
          reason = body?.details?.message   // Brevo's own error message
            || body?.error                  // our error string
            || error.message;
        } catch (_) {
          // context body wasn't JSON — log raw text if possible
          try {
            const text = await error.context?.text();
            console.error("Edge Function error text:", text);
            reason = text || error.message;
          } catch (_) {}
        }
        return { ok: false, reason };
      }

      return { ok: true, data };
    } catch (err) {
      console.error("Emergency email unexpected error:", err);
      return { ok: false, reason: err.message };
    }
  };

  // Expose globally so Trends.jsx / Write.jsx can call it
  if (typeof window !== "undefined") {
    window.__mindbloom_sendEmergencyEmail = sendEmergencyEmail;
  }

  const handleTestEmail = async () => {
    if (!emergencyEmail) {
      setTestEmailMsg("Please enter an emergency contact email first.");
      setTimeout(() => setTestEmailMsg(""), 4000);
      return;
    }
    setSendingTest(true);
    setTestEmailMsg("");
    const result = await sendEmergencyEmail({
      message: "This is a test alert to verify your emergency contact setup is working correctly.",
      score: 90,
    });
    setSendingTest(false);
    if (result.ok) {
      setTestEmailMsg("Test email sent! Check their inbox.");
    } else {
      // Show the real reason on screen so you can debug without opening DevTools
      setTestEmailMsg(`Failed: ${result.reason}`);
      console.error("Test email failed:", result.reason);
    }
    setTimeout(() => setTestEmailMsg(""), 8000);
  };

  // ── Change password ───────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordMsg(""); setPasswordError("");
    if (!newPassword || !confirmPassword) { setPasswordError("Please fill in both fields."); return; }
    if (newPassword !== confirmPassword)  { setPasswordError("Passwords do not match."); return; }
    if (newPassword.length < 8)           { setPasswordError("Password must be at least 8 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPasswordError(error.message); }
    else {
      setPasswordMsg("Password updated.");
      setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="pro-spinner" />
      </div>
    );
  }

  return (
    <div className="pro-page">

      <div className="pro-top">
        <h1 className="pro-title">Settings</h1>
      </div>

      {/* ── EMERGENCY CONTACT ── */}
      <div className="pro-group">
        <p className="pro-group-label">
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>{Icon.shield} Emergency Contact</span>
        </p>
        <div className="pro-card">
          <div className="pro-field">
            <label className="pro-label">Contact Name</label>
            <input
              className="pro-input"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="e.g. Mom, Dr. Santos"
            />
          </div>
          <div className="pro-divider" />
          <div className="pro-field">
            <label className="pro-label">Contact Email</label>
            <input
              className="pro-input"
              type="email"
              value={emergencyEmail}
              onChange={(e) => setEmergencyEmail(e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
          <div className="pro-divider" />

          {/* Toggle */}
          <div className="pro-toggle-row">
            <div>
              <p className="pro-toggle-title">Enable Emergency Alerts</p>
              <p className="pro-toggle-desc">
                Automatically email your contact when a critical stress pattern is detected in your journal entries.
              </p>
            </div>
            <label className="pro-toggle">
              <input
                type="checkbox"
                checked={emergencyAlerts}
                onChange={(e) => setEmergencyAlerts(e.target.checked)}
              />
              <span className="pro-toggle-track">
                <span className="pro-toggle-thumb" />
              </span>
            </label>
          </div>

          <div className="pro-divider" />

          {/* Test email button */}
          <div style={{ padding: "10px 0 4px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              className="pro-btn"
              onClick={handleTestEmail}
              disabled={sendingTest || !emergencyEmail}
              style={{ background: "#fff", color: "#e8607a", border: "1.5px solid #f4c0cf", minWidth: 160 }}
            >
              {sendingTest ? "Sending…" : "Send test alert email"}
            </button>
            {testEmailMsg && (
              <span style={{
                fontSize: 13,
                color: testEmailMsg.startsWith("Failed") ? "#c62828" : "#2e7d32",
                maxWidth: 320,
              }}>
                {testEmailMsg}
              </span>
            )}
          </div>

          <div className="pro-card-footer">
            <button className="pro-btn" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save emergency contact"}
            </button>
            {saveMsg && (
              <span style={{ fontSize: 13, marginLeft: 12, color: saveMsgType === "success" ? "#2e7d32" : "#c62828" }}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>

        {/* Info box */}
        <div style={{
          marginTop: 10, background: "#FFF8E8", border: "1px solid #F5C842",
          borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#7a5c00", lineHeight: 1.6,
        }}>
          <strong>How it works:</strong> When MindBloom detects a consistently negative emotional pattern
          (e.g. 4+ negative entries in a row), it sends your emergency contact a caring, non-alarmist email
          letting them know you may need support — without sharing the content of your entries.
        </div>
      </div>

      {/* ── NOTIFICATIONS ── */}
      <div className="pro-group">
        <p className="pro-group-label">
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>{Icon.bell} Notifications</span>
        </p>
        <div className="pro-card">
          <div className="pro-toggle-row">
            <div>
              <p className="pro-toggle-title">Email Notifications</p>
              <p className="pro-toggle-desc">Receive weekly summaries and tips via email.</p>
            </div>
            <label className="pro-toggle">
              <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
              <span className="pro-toggle-track"><span className="pro-toggle-thumb" /></span>
            </label>
          </div>
          <div className="pro-divider" />
          <div className="pro-toggle-row">
            <div>
              <p className="pro-toggle-title">Daily Reminders</p>
              <p className="pro-toggle-desc">Get a gentle nudge to journal each day.</p>
            </div>
            <label className="pro-toggle">
              <input type="checkbox" checked={reminderNotifs} onChange={(e) => setReminderNotifs(e.target.checked)} />
              <span className="pro-toggle-track"><span className="pro-toggle-thumb" /></span>
            </label>
          </div>
          <div className="pro-card-footer">
            <button className="pro-btn" onClick={handleSaveProfile} disabled={saving}>
              Save preferences
            </button>
          </div>
        </div>
      </div>

      {/* ── PASSWORD ── */}
      <div className="pro-group">
        <p className="pro-group-label">
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>{Icon.lock} Password</span>
        </p>
        <div className="pro-card">
          <div className="pro-field">
            <label className="pro-label">New Password</label>
            <input type="password" className="pro-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div className="pro-field">
            <label className="pro-label">Confirm Password</label>
            <input type="password" className="pro-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
          </div>
          {passwordError && <p style={{ fontSize: 13, color: "#c62828" }}>{passwordError}</p>}
          {passwordMsg   && <p style={{ fontSize: 13, color: "#2e7d32" }}>{passwordMsg}</p>}
          <div className="pro-card-footer">
            <button className="pro-btn" onClick={handleChangePassword}>Update Password</button>
          </div>
        </div>
      </div>

      {/* ── SIGN OUT ── */}
      <div className="pro-group">
        <p className="pro-group-label">
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>{Icon.logout} Session</span>
        </p>
        <div className="pro-card">
          <button
            className="pro-btn"
            onClick={handleLogout}
            style={{ background: "white", color: "#e04863", border: "1px solid #f1c3cb" }}
          >
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}