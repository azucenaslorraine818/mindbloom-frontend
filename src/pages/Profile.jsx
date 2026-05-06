import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function getStreak(entries) {
  if (!entries.length) return 0;
  const dates = [
    ...new Set(
      entries.map((e) =>
        new Date(e.created_at + "Z").toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
        })
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diff = (curr - next) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", age: "", sex: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setLoading(false); return; }

      setEmail(user.email || "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData || null);
      setForm({
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        age: profileData?.age || "",
        sex: profileData?.sex || "",
      });

      const { data: entryData } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
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

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: form.first_name,
        last_name: form.last_name,
        age: form.age ? Number(form.age) : null,
        sex: form.sex,
      });

    if (!error) {
      setProfile((prev) => ({ ...prev, ...form }));
      setEditing(false);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p style={{ color: "#8a6672" }}>Loading profile...</p>
      </div>
    );
  }

  // Stats
  const totalEntries = entries.length;
  const streak = getStreak(entries);
  const posCount = entries.filter((e) => e.tone === "Positive").length;
  const negCount = entries.filter((e) => e.tone === "Negative").length;
  const neuCount = entries.filter((e) => e.tone === "Neutral").length;
  const mostCommon =
    posCount >= negCount && posCount >= neuCount
      ? "Positive"
      : negCount >= posCount && negCount >= neuCount
      ? "Negative"
      : "Neutral";

  const mostCommonColor =
    mostCommon === "Positive" ? "#6DBF8A" :
    mostCommon === "Negative" ? "#E8607A" : "#A0AEC0";

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "No name set";

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>My Profile 👤</h1>
        <p>Manage your personal info and see your stats.</p>
      </div>

      {/* AVATAR + NAME */}
      <div className="profile-card profile-identity">
        <div className="profile-avatar">
          {(profile?.first_name?.[0] || "?").toUpperCase()}
        </div>
        <div>
          <h2 className="profile-name">{fullName}</h2>
          <p className="profile-email">{email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <p className="profile-stat-value">{totalEntries}</p>
          <p className="profile-stat-label">Total Entries</p>
        </div>
        <div className="profile-stat-card">
          <p className="profile-stat-value">{streak}</p>
          <p className="profile-stat-label">Day Streak</p>
        </div>
        <div className="profile-stat-card">
          <p className="profile-stat-value" style={{ color: mostCommonColor }}>{mostCommon}</p>
          <p className="profile-stat-label">Most Common Tone</p>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="profile-card">
        <div className="profile-card-header">
          <p className="profile-card-title">Personal Info</p>
          {!editing && (
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>First Name</label>
                <input
                  className="profile-input"
                  value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div className="profile-form-group">
                <label>Last Name</label>
                <input
                  className="profile-input"
                  value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>Age</label>
                <input
                  className="profile-input"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                  placeholder="Age"
                  min="10"
                  max="120"
                />
              </div>
              <div className="profile-form-group">
                <label>Sex</label>
                <select
                  className="profile-input"
                  value={form.sex}
                  onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))}
                >
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
              <button className="profile-cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info-list">
            {[
              ["First Name", profile?.first_name || "—"],
              ["Last Name", profile?.last_name || "—"],
              ["Age", profile?.age || "—"],
              ["Sex", profile?.sex === "M" ? "Male" : profile?.sex === "F" ? "Female" : "Prefer not to say"],
              ["Email", email],
            ].map(([label, value]) => (
              <div className="profile-info-row" key={label}>
                <span className="profile-info-label">{label}</span>
                <span className="profile-info-value">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button className="profile-logout-btn" onClick={handleLogout}>
        Sign Out
      </button>

    </div>
  );
}