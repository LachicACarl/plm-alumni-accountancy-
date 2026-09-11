import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, LockKeyhole, UserRound } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[#18392b] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#d4af37]">
                PAMANTASAN NG LUNGSOD NG MAYNILA
              </p>
              <p className="text-sm font-bold">
                College of Accountancy
              </p>
            </div>
          </Link>

          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
              BSA ALUMNI SYSTEM
            </p>

            <h1 className="mt-5 font-serif text-6xl font-bold leading-tight">
              Welcome Back,
              <br />
              Alumni.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
              Reconnect with your fellow graduates, manage your credentials,
              and stay updated with the PLM College of Accountancy community.
            </p>
          </div>

          <p className="text-sm text-white/50">
            © 2026 PLM College of Accountancy
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#18392b] hover:underline"
            >
              <ArrowLeft size={17} />
              Back to home
            </Link>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-8 shadow-sm">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                  <GraduationCap size={30} />
                </div>

                <h2 className="mt-5 font-serif text-3xl font-bold text-[#18392b]">
                  Sign In
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Access your BSA Alumni account
                </p>
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
                <span className="font-bold text-[#4285f4]">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  or
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                    Username
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-[#18392b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-[#18392b]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#18392b]"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-medium text-[#18392b] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#18392b] px-4 py-3 font-semibold text-white transition hover:bg-[#24513d]"
                >
                  Sign In
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-gray-500">
                New alumni?
                <button className="ml-1 font-semibold text-[#18392b] hover:underline">
                  Register your account
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
