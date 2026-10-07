import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        throw new Error("Invalid admin email or password.");
      }

      if (!authData.user) {
        throw new Error("Unable to authenticate the administrator.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email, role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error(
          "Administrator profile was not found. Please contact the system administrator."
        );
      }

      if (!["admin", "head_admin"].includes(profile.role)) {
        await supabase.auth.signOut();
        throw new Error(
          "This account does not have administrator access."
        );
      }

      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(
        loginError?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-[#18392b] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={26} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#d4af37]">
                PAMANTASAN NG LUNGSOD NG MAYNILA
              </p>
              <p className="text-sm font-bold">College of Accountancy</p>
            </div>
          </Link>

          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#d4af37]">
              <ShieldCheck size={30} />
            </div>

            <h1 className="max-w-xl font-serif text-4xl font-bold leading-tight text-white">
              BSA Alumni System
              <br />
              Administration
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
              Manage alumni records, credentials, achievements, batches, and
              events through the College of Accountancy administration portal.
            </p>
          </div>

          <p className="text-xs text-white/40">
            PLM College of Accountancy • BSA Alumni System
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18392b] text-[#d4af37] lg:mx-0">
                <ShieldCheck size={32} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7b16]">
                Administrator Access
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold">
                Admin Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to manage the BSA Alumni System.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm sm:p-8"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter admin email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-20 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#18392b] hover:text-[#9a7b16]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24513d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {loading ? "Signing In..." : "Sign In as Admin"}
              </button>

              <div className="mt-6 border-t border-[#e4dfd3] pt-5 text-center">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#18392b] hover:text-[#9a7b16]"
                >
                  Alumni Login
                </Link>

                <span className="mx-2 text-slate-300">•</span>

                <Link
                  to="/"
                  className="text-sm text-slate-500 hover:text-[#18392b]"
                >
                  Back to Website
                </Link>
              </div>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400">
              Authorized administrators only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
