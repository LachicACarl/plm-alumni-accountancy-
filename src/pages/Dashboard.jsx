import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  Menu,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = [
    {
      label: "Profile Status",
      value: "Complete",
      description: "Your profile is up to date",
      icon: UserRound,
      tone: "green",
    },
    {
      label: "Credentials",
      value: "3",
      description: "Verified credentials",
      icon: FileCheck2,
      tone: "gold",
    },
    {
      label: "Achievements",
      value: "5",
      description: "Milestones recorded",
      icon: Award,
      tone: "green",
    },
    {
      label: "Events",
      value: "2",
      description: "Upcoming events",
      icon: CalendarDays,
      tone: "gold",
    },
  ];

  const activities = [
    {
      title: "Profile information updated",
      date: "June 5, 2026",
      icon: UserRound,
    },
    {
      title: "Credential submitted for verification",
      date: "May 28, 2026",
      icon: FileCheck2,
    },
    {
      title: "Achievement added to your profile",
      date: "May 20, 2026",
      icon: Award,
    },
  ];

  const events = [
    {
      month: "JUN",
      day: "20",
      title: "BSA Alumni General Assembly",
      description: "Reconnect with fellow Accountancy alumni.",
    },
    {
      month: "JUL",
      day: "12",
      title: "Alumni Career Networking",
      description: "Meet professionals and build new connections.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-h-screen lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[#ddd7c8]/80 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-[#ddd7c8] bg-white p-2.5 text-[#18392b] shadow-sm transition hover:border-[#d4af37] hover:bg-[#faf8f0] lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu size={21} />
              </button>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a08f67]">
                  PLM College of Accountancy
                </p>
                <h1 className="mt-0.5 font-serif text-2xl font-bold text-[#18392b]">
                  Alumni Dashboard
                </h1>
              </div>
            </div>

            <Link
              to="/"
              className="hidden items-center gap-2 rounded-full border border-[#ddd7c8] px-4 py-2 text-sm font-semibold text-[#18392b] transition hover:border-[#d4af37] hover:bg-[#faf8f0] sm:inline-flex"
            >
              Back to Website
              <ChevronRight size={15} />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
          {/* Welcome Hero */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#18392b] shadow-[0_18px_50px_rgba(24,57,43,0.16)]">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#d4af37]/20" />
            <div className="absolute -bottom-36 right-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-3xl" />

            <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-11">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#e3c55a]">
                  <Sparkles size={13} />
                  Welcome back
                </div>

                <h2 className="mt-5 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Hello, Maria Santos
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  Welcome to your BSA Alumni account. Manage your profile,
                  credentials, achievements, and connections with the
                  Pamantasan ng Lungsod ng Maynila community.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#18392b] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#e1c253]"
                  >
                    View My Profile
                    <ChevronRight size={16} />
                  </Link>

                  <Link
                    to="/dashboard/events"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore Events
                  </Link>
                </div>
              </div>

              <div className="flex items-end lg:min-w-[210px]">
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50">
                        Alumni Batch
                      </p>
                      <p className="mt-0.5 font-serif text-xl font-bold text-white">
                        BSA 2025
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-px bg-white/10" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      Member status
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37]">
                      <CheckCircle2 size={13} />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isGold = stat.tone === "gold";

              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-[0_8px_24px_rgba(24,57,43,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(24,57,43,0.09)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#96896f]">
                        {stat.label}
                      </p>
                      <p className="mt-2 font-serif text-2xl font-bold text-[#18392b]">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isGold
                          ? "bg-[#d4af37]/15 text-[#a17e16]"
                          : "bg-[#18392b]/8 text-[#18392b]"
                      }`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Main Content */}
          <section className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_0.9fr]">
            {/* Profile */}
            <div className="rounded-[24px] border border-[#ddd7c8] bg-white p-6 shadow-[0_8px_24px_rgba(24,57,43,0.05)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                    Your Information
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    My Profile
                  </h3>
                </div>

                <Link
                  to="/dashboard/profile"
                  className="hidden items-center gap-1 text-sm font-bold text-[#18392b] hover:text-[#9b7915] sm:inline-flex"
                >
                  View profile
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8f6ef] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#18392b] text-white shadow-md">
                    <UserRound size={34} />
                    <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#f8f6ef] bg-[#d4af37] text-[#18392b]">
                      <CheckCircle2 size={13} />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-serif text-xl font-bold text-[#18392b]">
                      Maria Santos
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Bachelor of Science in Accountancy • Batch 2025
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#18392b]/75">
                      Certified Public Accountant
                    </p>
                  </div>

                  <span className="sm:ml-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    <CheckCircle2 size={13} />
                    Complete
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  to="/dashboard/profile"
                  className="rounded-xl border border-[#ddd7c8] bg-white p-4 transition hover:border-[#d4af37] hover:bg-[#faf8f0]"
                >
                  <UserRound size={19} />
                  <p className="mt-3 text-sm font-bold">Edit Profile</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Update information
                  </p>
                </Link>

                <Link
                  to="/dashboard/credentials"
                  className="rounded-xl border border-[#ddd7c8] bg-white p-4 transition hover:border-[#d4af37] hover:bg-[#faf8f0]"
                >
                  <FileCheck2 size={19} />
                  <p className="mt-3 text-sm font-bold">Credentials</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage documents
                  </p>
                </Link>

                <Link
                  to="/dashboard/achievements"
                  className="rounded-xl border border-[#ddd7c8] bg-white p-4 transition hover:border-[#d4af37] hover:bg-[#faf8f0]"
                >
                  <Award size={19} />
                  <p className="mt-3 text-sm font-bold">Achievements</p>
                  <p className="mt-1 text-xs text-gray-500">
                    View milestones
                  </p>
                </Link>
              </div>
            </div>

            {/* Community Card */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#d4af37] p-7 text-[#18392b] shadow-[0_12px_32px_rgba(24,57,43,0.08)]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#18392b]/10" />
              <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18392b] text-[#d4af37]">
                  <UsersRound size={23} />
                </div>

                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#18392b]/60">
                  Alumni Community
                </p>

                <h3 className="mt-2 font-serif text-2xl font-bold">
                  Stay Connected
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#18392b]/70">
                  Discover events, reconnect with classmates, and stay
                  connected with the growing BSA alumni community.
                </p>

                <Link
                  to="/dashboard/events"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24513d]"
                >
                  View Events
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* Events + Activity */}
          <section className="mt-7 grid gap-7 xl:grid-cols-2">
            {/* Upcoming Events */}
            <div className="rounded-[24px] border border-[#ddd7c8] bg-white p-6 shadow-[0_8px_24px_rgba(24,57,43,0.05)] sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                    Calendar
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Upcoming Events
                  </h3>
                </div>

                <Link
                  to="/dashboard/events"
                  className="text-sm font-bold text-[#18392b] hover:text-[#9b7915]"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className="flex gap-4 rounded-2xl border border-[#eee9dc] bg-[#fbfaf6] p-4 transition hover:border-[#d4af37]/50"
                  >
                    <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#18392b] text-white">
                      <span className="text-[10px] font-bold tracking-wider text-[#d4af37]">
                        {event.month}
                      </span>
                      <span className="font-serif text-xl font-bold">
                        {event.day}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#18392b]">
                        {event.title}
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-[24px] border border-[#ddd7c8] bg-white p-6 shadow-[0_8px_24px_rgba(24,57,43,0.05)] sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                    Account Activity
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Recent Activity
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f6ef] text-[#18392b]">
                  <CalendarDays size={19} />
                </div>
              </div>

              <div className="mt-5 divide-y divide-[#eee9dc]">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.title}
                      className="flex gap-4 py-4 first:pt-1 last:pb-1"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8f6ef] text-[#18392b]">
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#18392b]">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-[#ddd7c8] pt-6">
            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © 2026 PLM College of Accountancy Alumni System
              </p>
              <p className="font-medium text-[#18392b]/60">
                Pamantasan ng Lungsod ng Maynila
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
