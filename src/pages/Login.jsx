import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  UserRound,
} from "lucide-react";
import plmCampus from "../assets/plm-campus.jpg";
import plmLogo from "../../assets/plm-accountancy-logo.svg";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
    localStorage.setItem("alumniUser", username.trim());

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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5ee]">
      {/* =====================================================
          CAMPUS BACKGROUND
          ===================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${plmCampus})` }}
      />

      {/* Main soft white wash */}
      <div className="absolute inset-0 bg-white/72" />

      {/* PLM green atmosphere */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#b8d7ae]/35 blur-3xl" />

      {/* PLM gold atmosphere */}
      <div className="absolute -bottom-40 left-1/3 h-[520px] w-[620px] rounded-full bg-[#e7cf7e]/25 blur-3xl" />

      {/* Right-side subtle green tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#edf6e9]/70 via-white/45 to-[#e7d99e]/30" />

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/58 to-white/48" />

      {/* =====================================================
          PAGE CONTENT
          ===================================================== */}
      <div className="relative z-10 min-h-screen">
        {/* ===================================================
            HEADER
            =================================================== */}
        <header className="px-5 py-5 sm:px-8 lg:px-12 lg:py-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <img
              src={plmLogo}
              alt="PLM College of Accountancy"
              className="h-14 w-auto object-contain sm:h-[70px]"
            />

            <div className="hidden border-l border-[#183d2d]/20 pl-4 sm:block">
              <p className="text-[10px] font-bold tracking-[0.20em] text-[#183d2d]/70">
                PAMANTASAN NG LUNGSOD NG MAYNILA
              </p>

              <p className="mt-1 text-xs font-extrabold tracking-[0.12em] text-[#b08b20]">
                COLLEGE OF ACCOUNTANCY
              </p>
            </div>
          </Link>
        </header>

        {/* ===================================================
            MAIN
            =================================================== */}
        <main className="mx-auto flex min-h-[calc(100vh-105px)] max-w-[1500px] items-center px-5 pb-10 sm:px-8 lg:px-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-16 xl:gap-24">

            {/* =================================================
                LEFT BRANDING
                ================================================= */}
            <section className="hidden lg:block pl-3 xl:pl-8">
              <div className="max-w-4xl animate-[plm-fade-up_700ms_ease_both]">

                {/* BSA Alumni System title */}
                <div className="flex items-center">

                  {/* BSA */}
                  <div className="pr-7 xl:pr-9">
                    <h1
                      className="bg-gradient-to-b from-[#d7b93e] via-[#a9bd68] to-[#65966d] bg-clip-text text-[7rem] font-black leading-[0.80] tracking-[-0.075em] text-transparent xl:text-[9rem]"
                    >
                      BSA
                    </h1>
                  </div>

                  {/* Vertical divider */}
                  <div className="h-36 w-[3px] rounded-full bg-gradient-to-b from-[#b99739] via-[#8d7842] to-[#6d8d6c] xl:h-40" />

                  {/* Alumni System */}
                  <div className="pl-7 xl:pl-9">
                    <p className="text-[4.3rem] font-black leading-[0.86] tracking-[-0.055em] text-[#28583e] xl:text-[5.5rem]">
                      ALUMNI
                    </p>

                    <p className="mt-1 text-[4.3rem] font-black leading-[0.86] tracking-[-0.055em] text-[#d4b24b] xl:text-[5.5rem]">
                      SYSTEM
                    </p>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-[3px] w-14 rounded-full bg-[#c5a33d]" />
                  <div className="h-[3px] w-28 rounded-full bg-[#719878]/70" />
                </div>

                {/* Tagline */}
                <p className="mt-7 max-w-2xl font-serif text-[1.65rem] font-semibold leading-[1.35] text-[#64756d] xl:text-[2rem]">
                  Strengthening connections.
                  <br />
                  Honoring our legacy.
                  <br />
                  Building the future together.
                </p>

                {/* Small description */}
                <p className="mt-6 max-w-xl text-sm leading-6 text-[#68776f]/85">
                  A dedicated digital space connecting the PLM College of
                  Accountancy alumni community through memories, achievements,
                  credentials, and lifelong connections.
                </p>
              </div>
            </section>

            {/* =================================================
                LOGIN CARD
                ================================================= */}
            <section className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[470px] animate-[plm-scale-in_500ms_ease_both]">

                <div className="relative overflow-hidden rounded-[24px] border border-white/75 bg-white/65 p-6 shadow-[0_24px_80px_rgba(24,61,45,0.15)] backdrop-blur-2xl sm:p-8">

                  {/* Card decorative glow */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#d8bd68]/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#76ad7d]/20 blur-3xl" />

                  <div className="relative">

                    {/* Mobile branding */}
                    <div className="mb-7 text-center lg:hidden">
                      <img
                        src={plmLogo}
                        alt="PLM College of Accountancy"
                        className="mx-auto h-20 w-auto object-contain"
                      />

                      <div className="mt-4">
                        <p className="text-3xl font-black tracking-[-0.05em] text-[#28583e]">
                          BSA{" "}
                          <span className="text-[#d4b24b]">ALUMNI</span>
                        </p>

                        <p className="text-xs font-bold tracking-[0.20em] text-[#719878]">
                          SYSTEM
                        </p>
                      </div>
                    </div>

                    {/* Login icon */}
                    <div className="text-center">
                      <div className="mx-auto mb-5 flex h-[66px] w-[66px] items-center justify-center rounded-full border border-[#c7dfc1] bg-gradient-to-br from-[#e1f0dc] to-[#f2f7e9] text-[#579269] shadow-[inset_0_2px_8px_rgba(255,255,255,0.8)]">
                        <UserRound size={30} strokeWidth={1.6} />
                      </div>

                      <h2 className="font-serif text-[2rem] font-medium tracking-[-0.02em] text-[#202820] sm:text-[2.15rem]">
                        Log in to your account
                      </h2>

                      <p className="mt-1 text-sm text-[#7e8981]">
                        Enter your details to login
                      </p>
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="mt-7 flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-[#b5bdb5] bg-white/75 px-5 text-sm font-medium text-[#3f4841] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      <span className="flex h-6 w-6 items-center justify-center text-[19px] font-bold text-[#4285F4]">
                        G
                      </span>

                      Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                      <div className="h-px flex-1 bg-[#b7beb8]" />
                      <span className="text-[11px] font-medium text-[#858d86]">
                        OR
                      </span>
                      <div className="h-px flex-1 bg-[#b7beb8]" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                      {/* Username */}
                      <div className="relative">
                        <UserRound
                          size={18}
                          strokeWidth={1.5}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69756d]"
                        />

                        <input
                          type="text"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="Username or email"
                          className="h-14 w-full rounded-xl border border-[#a8afa9] bg-white/65 pl-12 pr-4 text-sm text-[#263129] outline-none transition-all duration-200 placeholder:text-[#727b74] hover:border-[#7da384] focus:border-[#4f9364] focus:bg-white/90 focus:ring-4 focus:ring-[#4f9364]/10"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <Lock
                          size={18}
                          strokeWidth={1.5}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#69756d]"
                        />

                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Password"
                          className="h-14 w-full rounded-xl border border-[#a8afa9] bg-white/65 pl-12 pr-12 text-sm text-[#263129] outline-none transition-all duration-200 placeholder:text-[#727b74] hover:border-[#7da384] focus:border-[#4f9364] focus:bg-white/90 focus:ring-4 focus:ring-[#4f9364]/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707970] transition-colors hover:text-[#28583e]"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {/* Options */}
                      <div className="flex items-center justify-between gap-4 px-1">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#656d66] sm:text-sm">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(event) =>
                              setRemember(event.target.checked)
                            }
                            className="h-4 w-4 rounded accent-[#578d68]"
                          />

                          Remember me
                        </label>

                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs font-medium text-[#6c746d] transition-colors hover:text-[#a27e19] sm:text-sm"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Error */}
                      {error && (
                        <div
                          role="alert"
                          className="rounded-xl border border-[#dfc979] bg-[#fff8dc]/90 px-4 py-3 text-sm leading-5 text-[#765d10]"
                        >
                          {error}
                        </div>
                      )}

                      {/* Login */}
                      <button
                        type="submit"
                        className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#dfbb4c] via-[#aabd68] to-[#63a375] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(83,128,88,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(83,128,88,0.30)]"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />
                        <span className="relative">Log In</span>
                      </button>
                    </form>

                    {/* Registration */}
                    <div className="mt-5 text-center">
                      <p className="text-xs text-[#7c847d]">
                        Don't have an account?
                      </p>

                      <button
                        type="button"
                        onClick={handleRegister}
                        className="mt-1 text-xs font-semibold text-[#a08021] transition-colors hover:text-[#28583e]"
                      >
                        Contact administrator
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back to website */}
                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#5f6961] transition-all duration-200 hover:bg-white/50 hover:text-[#28583e]"
                  >
                    <ArrowLeft size={14} />
                    Back to Website
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
