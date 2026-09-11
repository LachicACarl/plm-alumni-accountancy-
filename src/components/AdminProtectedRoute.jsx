import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
