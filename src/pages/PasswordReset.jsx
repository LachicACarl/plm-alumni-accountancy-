import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import plmCampus from "../assets/plm-campus.jpg";
import plmLogo from "../../assets/plm-accountancy-logo.svg";
import { supabase } from "../lib/supabase";

export default function PasswordReset() {
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    let timeoutId;

    // Only accept a signed-in event when Supabase returned from an invite link.
    // Ordinary pre-existing sessions must not unlock password changes.
    const inviteFlow = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "invite";

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;
        if ((event === "PASSWORD_RECOVERY" || (inviteFlow && event === "SIGNED_IN")) && session) {
          window.clearTimeout(timeoutId);
          setRecoveryReady(true);
          setChecking(false);
          setError("");
        }
      }
    );

    // A normal existing session is deliberately not accepted as proof of recovery or invitation.
    timeoutId = window.setTimeout(() => {
      if (!active) return;
      setChecking(false);
      setError("This password reset link is invalid or has expired. Please request a new one.");
    }, 10000);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    if (!recoveryReady) {
      setError("Your recovery session is no longer valid. Please request a new reset link.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess("Your password has been updated. You can now sign in.");
      setPassword("");
      setConfirmation("");
      await supabase.auth.signOut();
    } catch (updateError) {
      console.error("Password update failed:", updateError);
      setError(updateError.message || "Unable to update your password. Please request a new reset link.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5ee]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${plmCampus})` }} />
      <div className="absolute inset-0 bg-white/75" />
      <div className="relative z-10 min-h-screen">
        <header className="px-5 py-5 sm:px-8 lg:px-12 lg:py-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={plmLogo} alt="PLM College of Accountancy" className="h-14 w-auto object-contain sm:h-[70px]" />
          </Link>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-105px)] max-w-[560px] items-center px-5 pb-10 sm:px-8">
          <section className="w-full rounded-[24px] border border-white/75 bg-white/80 p-6 shadow-[0_24px_80px_rgba(24,61,45,0.15)] backdrop-blur-2xl sm:p-9">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#28583e] hover:text-[#a27e19]">
              <ArrowLeft size={16} /> Back to login
            </Link>
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a08021]">Account Security</p>
              <h1 className="mt-2 font-serif text-3xl font-bold text-[#28583e]">Set a new password</h1>
              <p className="mt-2 text-sm leading-6 text-[#68736f]">Choose a new password for your PLM BSA Alumni account.</p>
            </div>

            {checking && <p role="status" className="mt-7 rounded-xl border border-[#dedbd0] bg-white/70 px-4 py-3 text-sm text-[#68736f]">Verifying your password reset link...</p>}
            {error && !checking && <div role="alert" className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</div>}
            {success && <div role="status" className="mt-7 rounded-xl border border-[#b8d7b9] bg-[#edf8ee] px-4 py-3 text-sm leading-5 text-[#286044]">{success}</div>}

            {recoveryReady && !success && (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-[#28583e]">New password</label>
                  <div className="relative">
                    <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69756d]" />
                    <input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-xl border border-[#a8afa9] bg-white/65 pl-12 pr-12 text-sm outline-none focus:border-[#4f9364] focus:ring-4 focus:ring-[#4f9364]/10" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69756d]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-[#28583e]">Confirm new password</label>
                  <div className="relative">
                    <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69756d]" />
                    <input id="confirm-password" type={showConfirmation ? "text" : "password"} autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-14 w-full rounded-xl border border-[#a8afa9] bg-white/65 pl-12 pr-12 text-sm outline-none focus:border-[#4f9364] focus:ring-4 focus:ring-[#4f9364]/10" />
                    <button type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69756d]">
                      {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={saving} className="h-14 w-full rounded-xl bg-gradient-to-r from-[#dfbb4c] via-[#aabd68] to-[#63a375] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(83,128,88,0.22)] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? "Updating password..." : "Update password"}
                </button>
              </form>
            )}
            {success && <Link to="/login" className="mt-6 inline-flex text-sm font-semibold text-[#28583e] hover:text-[#a27e19]">Return to login</Link>}
            {!checking && !recoveryReady && !success && <Link to="/login" className="mt-6 inline-flex text-sm font-semibold text-[#28583e] hover:text-[#a27e19]">Return to login</Link>}
          </section>
        </main>
      </div>
    </div>
  );
}
