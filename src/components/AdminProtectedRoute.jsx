import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminProtectedRoute({ children, allowedRoles = ["admin", "head_admin"] }) {\n  const location = useLocation();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");\n  const [role, setRole] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (active) {
            setStatus("unauthenticated");
            setMessage("Your session has expired. Please sign in again.");
          }
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Admin profile lookup failed:", profileError);
          if (active) {
            setStatus("error");
            setMessage(
              "We could not verify your administrator profile. Your session has been kept. Please try again or contact the system administrator."
            );
          }
          return;
        }

        if (!profile || !["admin", "head_admin", "org"].includes(profile.role)) {
          if (active) {
            setStatus("unauthorized");
            setMessage("This account does not have administrator access.");
          }
          return;
        }

        if (active) { setRole(profile.role); setStatus("authorized"); }
      } catch (error) {
        console.error("Unable to verify administrator access:", error);
        if (active) {
          setStatus("error");
          setMessage(
            "We could not verify your administrator session. Please try again."
          );
        }
      }
    }

    checkAdminAccess();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] text-[#18392b]" role="status">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-[#18392b]" />
          <p className="mt-4 text-sm font-semibold">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] px-5 text-[#18392b]">
        <div className="w-full max-w-md rounded-2xl border border-[#ddd7c8] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <Link
            to="/admin/login"
            className="mt-6 inline-flex rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white hover:bg-[#24513d]"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] px-5 text-[#18392b]">
        <div className="w-full max-w-md rounded-2xl border border-[#ddd7c8] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Unable to verify admin access</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white hover:bg-[#24513d]"
          >
            Try Again
          </button>
          <div className="mt-4">
            <Link to="/admin/login" className="text-sm font-semibold text-[#18392b] underline">
              Return to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {\n    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;\n  }\n\n  return children;
}
