import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";
import BottomNav from "../components/navigation/BottomNav";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div id="app">

      <Sidebar handleLogout={handleLogout} />

      <main id="main">

        <Topbar />

        <div id="content">
          <Outlet />
        </div>

      </main>

      <BottomNav />

    </div>
  );
}