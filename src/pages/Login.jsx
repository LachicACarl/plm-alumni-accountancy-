import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("alumniLoggedIn") === "true";

    if (loggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username/email and password.");
      return;
    }

    localStorage.setItem("alumniLoggedIn", "true");
    localStorage.setItem(
      "alumniUser",
      username.trim()
    );

    if (remember) {
      localStorage.setItem("alumniRemembered", "true");
    } else {
      localStorage.removeItem("alumniRemembered");
    }

    navigate("/dashboard");
  }

  function handleGoogleLogin() {
    localStorage.setItem("alumniLoggedIn", "true");
    localStorage.setItem("alumniUser", "Google Alumni");
    localStorage.setItem("alumniRemembered", "true");

    navigate("/dashboard");
  }

  function handleForgotPassword() {
    setError("Password recovery will be connected to the backend later.");
  }

  function handleRegister() {
    setError("Alumni registration will be connected to the backend later.");
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[#18392b] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-sm text-white/80 transition hover:text-[#d4af37]"
          >
            <ArrowLeft size={18} />
            Back to Website
          </Link>

          <div className="mx-auto max-w-lg">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={42} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              PLM College of Accountancy
            </p>

            <h1 className="font-serif text-5xl font-bold leading-tight">
              BSA Alumni System
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-white/70">
              Stay connected with the College of Accountancy alumni community,
              manage your credentials, achievements, batch information, and
              alumni events.
            </p>
          </div>

          <p className="text-xs text-white/40">
            Pamantasan ng Lungsod ng Maynila
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 flex w-fit items-center gap-2 text-sm text-[#18392b] lg:hidden"
            >
              <ArrowLeft size={18} />
              Back to Website
            </Link>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#18392b] text-[#d4af37]">
                <GraduationCap size={32} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b16]">
                PLM College of Accountancy
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b]">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to your BSA Alumni account
              </p>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8d2c2] px-4 py-3 text-sm font-semibold text-[#18392b] transition hover:bg-[#f7f5ee]"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e5e0d5]" />
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-[#e5e0d5]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                    Username or Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Enter your username or email"
                      className="w-full rounded-xl border border-[#d8d2c2] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-[#d8d2c2] py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18392b]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 accent-[#18392b]"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-semibold text-[#18392b] hover:text-[#9a7b16]"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl bg-[#fff7df] px-4 py-3 text-sm text-[#765d10]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#18392b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#24533d]"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 border-t border-[#eee9df] pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>

                <button
                  type="button"
                  onClick={handleRegister}
                  className="mt-1 text-sm font-bold text-[#18392b] hover:text-[#9a7b16]"
                >
                  Register as Alumni
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              BSA Alumni System • PLM College of Accountancy
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
