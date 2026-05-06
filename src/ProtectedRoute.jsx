import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(undefined); // IMPORTANT: undefined vs null

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
      }

      if (mounted) {
        setSession(data?.session ?? null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div className="loading-dot" />
          <p>Loading MindBloom…</p>
        </div>
      </div>
    );
  }

  // 👇 safer check (prevents flicker bugs)
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}