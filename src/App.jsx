import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Write from "./pages/Write";
import History from "./pages/History";
import Trends from "./pages/Trends";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >

          <Route index element={<DashboardHome />} />
          <Route path="write" element={<Write />} />
          <Route path="history" element={<History />} />
          <Route path="trends" element={<Trends />} />
          <Route path="profile" element={<Profile />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}