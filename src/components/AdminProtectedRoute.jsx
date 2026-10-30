import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function checkAdminAccess() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (mounted) setStatus("unauthenticated");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          profileError ||
          !profile ||
          !["admin", "head_admin"].includes(profile.role)
        ) {
          await supabase.auth.signOut();

          if (mounted) setStatus("unauthorized");
          return;
        }

        if (mounted) setStatus("authorized");
      } catch (error) {
        console.error("Unable to verify administrator access:", error);
        if (mounted) setStatus("unauthorized");
      }
    }

    checkAdminAccess();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ee] text-[#18392b]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-[#18392b]" />
          <p className="mt-4 text-sm font-semibold">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (status !== "authorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
