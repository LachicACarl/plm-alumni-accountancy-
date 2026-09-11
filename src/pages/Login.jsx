import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8f2]">
      {/* Campus Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${plmCampus})` }}
      />

      {/* Soft Screenshot-Like Overlay */}
      <div className="absolute inset-0 bg-white/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#dff7df]/85 via-white/70 to-[#f8e8b1]/70" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Top Branding */}
        <header className="px-6 py-5 sm:px-10 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-4">
            <img
              src={plmLogo}
              alt="PLM College of Accountancy"
              className="h-16 w-auto object-contain sm:h-20"
            />

            <div className="hidden border-l border-[#18392b]/20 pl-4 sm:block">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#18392b]/70">
                PAMANTASAN NG LUNGSOD NG MAYNILA
              </p>
              <p className="mt-1 text-sm font-bold tracking-wide text-[#b08b20]">
                COLLEGE OF ACCOUNTANCY
              </p>
            </div>
          </Link>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-110px)] max-w-[1500px] items-center px-6 pb-10 sm:px-10 lg:px-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            {/* Left Branding */}
            <section className="hidden lg:block">
              <div className="max-w-3xl">
                <div className="flex items-center">
                  <div className="pr-7">
                    <h1 className="text-[7rem] font-black leading-[0.82] tracking-[-0.06em] text-transparent bg-clip-text bg-gradient-to-b from-[#d9b93e] via-[#a9bd68] to-[#6b9d72] xl:text-[8.5rem]">
                      BSA
                    </h1>
                  </div>

                  <div className="h-36 w-[3px] bg-[#8c7540]" />

                  <div className="pl-8">
                    <p className="text-[4.3rem] font-black leading-[0.9] tracking-[-0.04em] text-[#28583e] xl:text-[5.3rem]">
                      ALUMNI
                    </p>

                    <p className="text-[4.3rem] font-black leading-[0.9] tracking-[-0.04em] text-[#d6b44a] xl:text-[5.3rem]">
                      SYSTEM
                    </p>
                  </div>
                </div>

                <p className="mt-9 max-w-2xl font-serif text-2xl font-semibold leading-[1.35] text-[#65756e] xl:text-3xl">
                  Strengthening connections.
                  <br />
                  Honoring our legacy.
                  <br />
                  Building the future together.
                </p>
              </div>
            </section>

            {/* Login Card */}
            <section className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[500px]">
                <div className="rounded-2xl border border-[#9da99f]/50 bg-white/60 p-7 shadow-[0_20px_70px_rgba(24,57,43,0.12)] backdrop-blur-xl sm:p-9">
                  {/* Mobile Logo */}
                  <div className="mb-6 flex justify-center lg:hidden">
                    <img
                      src={plmLogo}
                      alt="PLM College of Accountancy"
                      className="h-20 w-auto"
                    />
                  </div>

                  {/* Login Heading */}
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#dcefdc] to-[#eef7e9] text-[#579269] shadow-inner">
                      <UserRound size={31} strokeWidth={1.7} />
                    </div>

                    <h2 className="font-serif text-3xl font-medium text-[#202820] sm:text-4xl">
                      Log in to your account
                    </h2>

                    <p className="mt-1 text-sm text-[#879087]">
                      Enter your details to login
                    </p>
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#aeb5ad] bg-white/70 px-5 py-3.5 text-sm font-medium text-[#424a43] transition hover:bg-white hover:shadow-md"
                  >
                    <span className="text-lg font-bold text-[#4285F4]">
                      G
                    </span>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#b8beb8]" />
                    <span className="text-xs text-[#858c85]">OR</span>
                    <div className="h-px flex-1 bg-[#b8beb8]" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div className="relative">
                      <UserRound
                        size={18}
                        strokeWidth={1.5}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667068]"
                      />

                      <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Username"
                        className="h-14 w-full rounded-xl border border-[#9fa79f] bg-white/65 pl-12 pr-4 text-sm text-[#263129] outline-none transition placeholder:text-[#697169] focus:border-[#5d906b] focus:bg-white/85 focus:ring-2 focus:ring-[#5d906b]/15"
                      />
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <Lock
                        size={18}
                        strokeWidth={1.5}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667068]"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="h-14 w-full rounded-xl border border-[#9fa79f] bg-white/65 pl-12 pr-12 text-sm text-[#263129] outline-none transition placeholder:text-[#697169] focus:border-[#5d906b] focus:bg-white/85 focus:ring-2 focus:ring-[#5d906b]/15"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707970] transition hover:text-[#28583e]"
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
                    <div className="flex items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-xs text-[#656d66] sm:text-sm">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(event) =>
                            setRemember(event.target.checked)
                          }
                          className="h-4 w-4 accent-[#578d68]"
                        />
                        Remember me
                      </label>

                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-medium text-[#6c746d] transition hover:text-[#a27e19] sm:text-sm"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="rounded-xl border border-[#dfc979] bg-[#fff8dc] px-4 py-3 text-sm text-[#765d10]">
                        {error}
                      </div>
                    )}

                    {/* Login */}
                    <button
                      type="submit"
                      className="h-14 w-full rounded-xl bg-gradient-to-r from-[#e0bc4c] via-[#a8ba67] to-[#62a375] text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Log In
                    </button>
                  </form>

                  {/* Register */}
                  <div className="mt-5 text-center">
                    <p className="text-xs text-[#7c847d]">
                      Don't have an account?
                    </p>

                    <button
                      type="button"
                      onClick={handleRegister}
                      className="mt-1 text-xs font-semibold text-[#a08021] transition hover:text-[#28583e]"
                    >
                      Contact administrator
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs text-[#5f6961] transition hover:text-[#28583e]"
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
