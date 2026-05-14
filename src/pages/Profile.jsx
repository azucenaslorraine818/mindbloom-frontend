import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function getStreak(entries) {
  if (!entries.length) return 0;
  const dates = [
    ...new Set(
      entries.map((e) =>
        new Date(e.created_at + "Z").toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function formatDob(dob) {
  if (!dob) return "—";
  return new Date(dob + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

// ── Inline SVG icons ───────────────────────────────────────────────
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8607a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8607a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const MoodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8607a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail]     = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", date_of_birth: "", sex: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setLoading(false); return; }
      setEmail(user.email || "");

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData || null);
      setForm({
        first_name:    profileData?.first_name    || "",
        last_name:     profileData?.last_name     || "",
        date_of_birth: profileData?.date_of_birth || "",
        sex:           profileData?.sex           || "",
      });

      const { data: entryData } = await supabase
        .from("entries").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setEntries(entryData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setSaving(false); return; }

    let age = profile?.age;
    if (form.date_of_birth) {
      const dob = new Date(form.date_of_birth);
      age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name:    form.first_name,
      last_name:     form.last_name,
      date_of_birth: form.date_of_birth || null,
      age,
      sex:           form.sex,
    });

    if (!error) { setProfile((prev) => ({ ...prev, ...form, age })); setEditing(false); }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div className="pro-spinner" />
      </div>
    );
  }

  const totalEntries = entries.length;
  const streak       = getStreak(entries);
  const posCount     = entries.filter((e) => e.tone === "Positive").length;
  const negCount     = entries.filter((e) => e.tone === "Negative").length;
  const neuCount     = entries.filter((e) => e.tone === "Neutral").length;
  const mostCommon   =
    posCount >= negCount && posCount >= neuCount ? "Positive"
    : negCount >= posCount && negCount >= neuCount ? "Negative" : "Neutral";
  const mostCommonColor =
    mostCommon === "Positive" ? "#6DBF8A" : mostCommon === "Negative" ? "#E8607A" : "#A0AEC0";

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "No name set";
  const sexLabel = profile?.sex === "M" ? "Male" : profile?.sex === "F" ? "Female" : profile?.sex || "Prefer not to say";
  const initials = (profile?.first_name?.[0] || "?").toUpperCase();

  return (
    <div className="profile-page">

      {/* ── HEADER ── */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal info and see your stats.</p>
      </div>

      {/* ── AVATAR + NAME ── */}
      <div className="profile-card profile-identity">
        <div className="profile-avatar">
          {profile?.first_name ? initials : <UserIcon />}
        </div>
        <div>
          <h2 className="profile-name">{fullName}</h2>
          <p className="profile-email">{email}</p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}><BookIcon /></div>
          <p className="profile-stat-value">{totalEntries}</p>
          <p className="profile-stat-label">Total Entries</p>
        </div>
        <div className="profile-stat-card">
          <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}><FlameIcon /></div>
          <p className="profile-stat-value">{streak}</p>
          <p className="profile-stat-label">Day Streak</p>
        </div>
        <div className="profile-stat-card">
          <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}><MoodIcon /></div>
          <p className="profile-stat-value" style={{ color: mostCommonColor }}>{mostCommon}</p>
          <p className="profile-stat-label">Most Common Tone</p>
        </div>
      </div>

      {/* ── PERSONAL INFO ── */}
      <div className="profile-card">
        <div className="profile-card-header">
          <p className="profile-card-title">Personal Info</p>
          {!editing && (
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>
              <EditIcon /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>First Name</label>
                <input className="profile-input" value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  placeholder="First name" />
              </div>
              <div className="profile-form-group">
                <label>Last Name</label>
                <input className="profile-input" value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  placeholder="Last name" />
              </div>
            </div>
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>Date of Birth</label>
                <input className="profile-input" type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
                  max={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="profile-form-group">
                <label>Sex</label>
                <select className="profile-input" value={form.sex}
                  onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))}>
                  <option value="">Prefer not to say</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
            <div className="profile-form-actions">
              <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button className="profile-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-info-list">
            {[
              ["First Name",    profile?.first_name    || "—"],
              ["Last Name",     profile?.last_name     || "—"],
              ["Date of Birth", formatDob(profile?.date_of_birth)],
              ["Age",           profile?.age           || "—"],
              ["Gender",        sexLabel],
              ["Email",         email],
              ["Emergency Contact",  profile?.emergency_contact_name  || "—"],
["Emergency Email",    profile?.emergency_contact_email || "—"],
            ].map(([label, value]) => (
              <div className="profile-info-row" key={label}>
                <span className="profile-info-label">{label}</span>
                <span className="profile-info-value">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LOGOUT ── */}
      <button className="profile-logout-btn" onClick={handleLogout}>
        <LogoutIcon /> Sign Out
      </button>

    </div>
  );
}
