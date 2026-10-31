import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  async function verifyAlumniSession(session) {
    if (!session?.user?.id) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, account_status")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      const isActiveAlumni =
        profile?.role === "alumni" &&
        (profile.account_status ?? "active") === "active";

      if (!isActiveAlumni) {
        // Invalidate this browser's session when the profile is missing,
        // no longer an alumni account, or administratively inactive.
        await supabase.auth.signOut();
        setAuthenticated(false);
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error("Unable to verify alumni account status:", error);
      // Fail closed: do not expose protected pages if the status check fails.
      await supabase.auth.signOut();
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error("Unable to restore alumni session:", error);
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      await verifyAlumniSession(data.session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      // Defer the profile query outside Supabase's auth callback to avoid
      // awaiting another Supabase request while the auth lock is held.
      Promise.resolve().then(() => {
        if (mounted) verifyAlumniSession(session);
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5ee]">
        <div className="text-center">
          <div className="text-sm font-medium text-[#174a2e]">
            Verifying your alumni account...
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
