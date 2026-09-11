import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Batches from "./pages/Batches";
import Events from "./pages/Events";
import Alumni from "./pages/Alumni";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Credentials from "./pages/Credentials";
import Achievements from "./pages/Achievements";
import Batch from "./pages/Batch";
import DashboardEvents from "./pages/DashboardEvents";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/credentials"
          element={
            <ProtectedRoute>
              <Credentials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/batch"
          element={
            <ProtectedRoute>
              <Batch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute>
              <DashboardEvents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
