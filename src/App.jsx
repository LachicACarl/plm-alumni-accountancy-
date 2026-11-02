import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Batches = lazy(() => import("./pages/Batches"));
const Events = lazy(() => import("./pages/Events"));
const Alumni = lazy(() => import("./pages/Alumni"));
const Login = lazy(() => import("./pages/Login"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Credentials = lazy(() => import("./pages/Credentials"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Batch = lazy(() => import("./pages/Batch"));
const DashboardEvents = lazy(() => import("./pages/DashboardEvents"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAlumni = lazy(() => import("./pages/AdminAlumni"));
const AdminCredentials = lazy(() => import("./pages/AdminCredentials"));
const AdminEvents = lazy(() => import("./pages/AdminEvents"));
const AdminBatches = lazy(() => import("./pages/AdminBatches"));
const AdminHomepage = lazy(() => import("./pages/AdminHomepage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] text-sm text-[#18392b]" role="status">
            Loading page...
          </div>
        }
      >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/events" element={<Events />} />

        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/admin/login" element={<AdminLogin />} />

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

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/homepage"
          element={
            <AdminProtectedRoute>
              <AdminHomepage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/alumni"
          element={
            <AdminProtectedRoute>
              <AdminAlumni />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminProtectedRoute>
              <AdminEvents />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/batches"
          element={
            <AdminProtectedRoute>
              <AdminBatches />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/credentials"
          element={
            <AdminProtectedRoute>
              <AdminCredentials />
            </AdminProtectedRoute>
          }
        />

        {/* Recover gracefully from malformed or unknown URLs. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
