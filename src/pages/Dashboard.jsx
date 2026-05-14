import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Sidebar from "../components/navigation/Sidebar";
import Topbar  from "../components/navigation/Topbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div id="app">

      {/* Mobile backdrop — tap to close */}
      {sidebarOpen && (
        <div
          className="sb-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        handleLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main id="main">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <div id="content">
          <Outlet />
        </div>
      </main>

    </div>
  );
}