import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/authx/profile/");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchProfile();
  }, [fetchProfile, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/authx/logout/");
    } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div style={S.container}>
        <div style={S.card}>
          <div style={S.cover} />
          <div style={{ padding: 24 }}>Loading…</div>
        </div>
      </div>
    );
  }

  // ---- Name logic: prefer username, then first+last, else Traveler
 // support either shape
  // ---- Name logic: prefer API username, else JWT claim, else first+last, else Traveler
  function usernameFromJWT() {
      try {
        const t = localStorage.getItem("token");
        if (!t) return "";
        const payload = JSON.parse(atob(t.split(".")[1] || ""));
        // Common claim keys your backend might use:
        return (
          payload.username ||
          payload.user ||
          payload.name ||
          payload.given_name ||
          ""
        );
      } catch {
        return "";
      }
    }

  const apiUsername =
    profile?.user?.username ?? // if backend returns nested user
    profile?.username ??       // if backend puts it at top-level
    "";

  const jwtUsername = usernameFromJWT();
  const cachedUsername = localStorage.getItem("username_hint") || "";

  const first = profile?.user?.first_name ?? profile?.first_name ?? "";
  const last  = profile?.user?.last_name  ?? profile?.last_name  ?? "";
  const nameFromNames = [first, last].filter(Boolean).join(" ");

  const displayName =
+  apiUsername || jwtUsername || cachedUsername || nameFromNames || "Traveler";
  

  const bio = profile?.bio ?? "—";
  const birthdate = profile?.birthdate ?? "—";
  const photo =
    profile?.photo ?? "https://via.placeholder.com/200?text=No+Photo";

  return (
    <div style={S.container}>
      <div style={S.card}>
        {/* Top gradient cover */}
        <div style={S.cover} />

        {/* Header bar with actions (replaces the solid blue bar) */}
        <div style={S.actionStrip}>
          <div style={S.titleWrap}>
            <h2 style={S.title}>Profile</h2>
          </div>
          <div style={S.actions}>
            <Link to="/questionnaire" style={{ ...S.pillBtn, ...S.primaryBtn }}>
              New Trip
            </Link>
            <Link to="/journal" style={S.pillBtn}>
              View Journals
            </Link>
            <Link to="/journal/add" style={S.pillBtn}>
              Add Journal
            </Link>
            <Link to="/editprofile" style={S.pillBtn}>
              Edit Profile
            </Link>
            <Link to="/profile/change-password" style={S.pillBtn}>
              Change Password
            </Link>
            <button type="button" onClick={handleLogout} style={S.pillBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Profile header block */}
        <div style={S.headerBlock}>
          <div style={S.avatarWrap}>
            <img src={photo} alt="Profile" style={S.avatar} />
          </div>
          <div style={S.headerText}>
            <div style={S.nameRow}>
              <h1 style={S.name}>Hi, {displayName} 👋</h1>
              <span style={S.badge}>Member</span>
            </div>
            <p style={S.subtle}>Your travel hub — plan, journal, and track.</p>
          </div>
        </div>

        {/* Content area */}
        <div style={S.content}>
          <div style={S.infoCard}>
            <h3 style={S.sectionTitle}>Profile info</h3>
            <p style={S.bio}>{bio}</p>
            <div style={S.kv}>
              <span style={S.k}>First name</span>
              <span style={S.v}>{first || "—"}</span>
            </div>

            <div style={S.kv}>
              <span style={S.k}>Last name</span>
              <span style={S.v}>{last || "—"}</span>
            </div>



            <div style={S.kv}>
              <span style={S.k}>Birthdate</span>
              <span style={S.v}>{birthdate}</span>
            </div>

            {/* Empty states can live here later (saved places, stats, etc.) */}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Styles (inline, no external CSS) ===== */
const S = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(180deg,#f8fafc, #eef2ff)",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: 980,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 12px 40px rgba(2,6,23,0.08)",
    overflow: "hidden",
    position: "relative",
  },
  cover: {
    height: 160,
    background:
      "linear-gradient(90deg, #4f46e5 0%, #0ea5e9 50%, #ec4899 100%)",
  },
  actionStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    background: "#fff",
    padding: "12px 16px",
    margin: "-32px 16px 0",
    borderRadius: 14,
    boxShadow: "0 6px 24px rgba(2,6,23,0.08)",
    position: "relative",
  },
  titleWrap: { display: "flex", alignItems: "center", gap: 10 },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: 0.2,
  },
  actions: { display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" },
  pillBtn: {
    appearance: "none",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#0f172a",
    padding: "8px 14px",
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all .15s ease",
  },
  primaryBtn: {
    background: "#4f46e5",
    borderColor: "#4f46e5",
    color: "#fff",
  },
  headerBlock: {
    display: "flex",
    gap: 16,
    alignItems: "flex-end",
    padding: "0 24px",
    marginTop: 16,
  },
  avatarWrap: {
    marginTop: -56,
    borderRadius: 24,
    background: "#fff",
    padding: 6,
    boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
    objectFit: "cover",
    display: "block",
  },
  headerText: { paddingBottom: 8 },
  nameRow: { display: "flex", alignItems: "center", gap: 10 },
  name: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
  },
  badge: {
    fontSize: 12,
    fontWeight: 700,
    color: "#4338ca",
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    padding: "4px 8px",
    borderRadius: 999,
  },
  subtle: { marginTop: 6, color: "#64748b", fontSize: 14 },
  content: { padding: 24 },
  infoCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    background: "#fff",
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
  },
  bio: {
    margin: "8px 0 16px",
    lineHeight: 1.6,
    color: "#334155",
    textAlign: "justify",
  },
  kv: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    paddingTop: 8,
    borderTop: "1px dashed #e5e7eb",
  },
  k: { width: 100, color: "#64748b", fontWeight: 600 },
  v: { color: "#0f172a", fontWeight: 600 },
};

export default Profile;
