import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminProtectedRoute({
  children,
  allowedRoles = ["admin", "head_admin"],
}) {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        // Resolve the persisted session before asking Auth to verify the user.
        // getUser() by itself can throw AuthSessionMissingError when no session
        // has been restored (for example, after a fresh tab or expired session).
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData?.session) {
          if (active) {
            setStatus("unauthenticated");
            setMessage("Your administrator session is missing or has expired. Please sign in again.");
          }
          return;
        }

        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          if (userError.name === "AuthSessionMissingError") {
            if (active) {
              setStatus("unauthenticated");
              setMessage("Your administrator session has expired. Please sign in again.");
            }
            return;
          }
          throw userError;
        }

        const user = userData?.user;
        if (!user) {
          if (active) {
            setStatus("unauthenticated");
            setMessage("Your administrator session has expired. Please sign in again.");
          }
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile || !["admin", "head_admin", "org"].includes(profile.role)) {
          if (active) {
            setStatus("unauthorized");
            setMessage("This account does not have administration access.");
          }
          return;
        }

        if (active) {
          setRole(profile.role);
          setStatus("authorized");
        }
      } catch (error) {
        console.error("Unable to verify admin access:", error);
        if (active) {
          setStatus("error");
          setMessage("We could not verify your account permissions. Please try again.");
        }
      }
    }

    checkAccess();
    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] text-[#18392b]" role="status">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-[#18392b]" />
          <p className="mt-4 text-sm font-semibold">Checking account permissions...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] px-5 text-[#18392b]">
        <div className="w-full max-w-md rounded-2xl border border-[#ddd7c8] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Administration access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <Link to="/admin/login" className="mt-6 inline-flex rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white hover:bg-[#24513d]">
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
          <h1 className="font-serif text-2xl font-bold">Unable to verify access</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white hover:bg-[#24513d]">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
