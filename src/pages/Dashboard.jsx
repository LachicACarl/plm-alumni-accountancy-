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
import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

const stats = [
  { label: "Profile Status", value: "Complete", description: "Your profile is up to date", icon: UserRound, tone: "green" },
  { label: "Credentials", value: "3", description: "Verified credentials", icon: FileCheck2, tone: "gold" },
  { label: "Achievements", value: "5", description: "Milestones recorded", icon: Award, tone: "green" },
  { label: "Events", value: "2", description: "Upcoming events", icon: CalendarDays, tone: "gold" },
];

const events = [
  { month: "JUN", day: "20", title: "BSA Alumni General Assembly" },
  { month: "JUL", day: "12", title: "Alumni Career Networking" },
];

const activities = [
  { title: "Profile information updated", date: "June 5, 2026", icon: UserRound },
  { title: "Credential submitted for verification", date: "May 28, 2026", icon: FileCheck2 },
  { title: "Achievement added to your profile", date: "May 20, 2026", icon: Award },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b] lg:flex">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-[#ddd7c8] bg-white p-2.5 lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8d72]">
                  PLM College of Accountancy
                </p>
                <h1 className="mt-0.5 font-serif text-2xl font-bold text-[#18392b]">
                  Alumni Dashboard
                </h1>
              </div>
            </div>

            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-xl border border-[#ddd7c8] px-4 py-2 text-sm font-semibold sm:inline-flex"
            >
              Back to Website
              <ChevronRight size={15} />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
          <section className="relative overflow-hidden rounded-[26px] bg-[#18392b] shadow-[0_16px_40px_rgba(24,57,43,0.13)]">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#d4af37]/20" />
            <div className="absolute -bottom-32 right-24 h-64 w-64 rounded-full border border-white/10" />

            <div className="relative grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_240px] lg:p-9">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e3c55a]">
                  <Sparkles size={12} />
                  Welcome back
                </div>

                <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
                  Hello, Maria Santos
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Welcome to your BSA Alumni account. Manage your profile,
                  credentials, achievements, and connections with the
                  Pamantasan ng Lungsod ng Maynila community.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link
                    to="/dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-4 py-2.5 text-sm font-bold text-[#18392b]"
                  >
                    View My Profile
                    <ChevronRight size={15} />
                  </Link>

                  <Link
                    to="/dashboard/events"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Explore Events
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
                    <GraduationCap size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      Alumni Batch
                    </p>
                    <p className="font-serif text-xl font-bold text-white">
                      BSA 2025
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">Member status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37]">
                    <CheckCircle2 size={13} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const gold = stat.tone === "gold";

              return (
                <div key={stat.label} className="rounded-2xl border border-[#ddd7c8] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#96896f]">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold">{stat.value}</p>
                    </div>

                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      gold ? "bg-[#d4af37]/15 text-[#a17e16]" : "bg-[#18392b]/10 text-[#18392b]"
                    }`}>
                      <Icon size={19} />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">{stat.description}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
            <div className="rounded-[22px] border border-[#ddd7c8] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                    Your Information
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold">My Profile</h3>
                </div>

                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#18392b]"
                >
                  View profile
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="mt-5 rounded-2xl bg-[#f8f6ef] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#18392b] text-white">
                    <UserRound size={29} />
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#f8f6ef] bg-[#d4af37] text-[#18392b]">
                      <CheckCircle2 size={11} />
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold">Maria Santos</h4>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Bachelor of Science in Accountancy � Batch 2025
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#18392b]/75">
                      Certified Public Accountant
                    </p>
                  </div>

                  <span className="sm:ml-auto inline-flex w-fit items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                    <CheckCircle2 size={11} />
                    Complete
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {[
                  ["/dashboard/profile", UserRound, "Edit Profile", "Update information"],
                  ["/dashboard/credentials", FileCheck2, "Credentials", "Manage documents"],
                  ["/dashboard/achievements", Award, "Achievements", "View milestones"],
                ].map(([path, Icon, title, description]) => (
                  <Link
                    key={path}
                    to={path}
                    className="rounded-xl border border-[#ddd7c8] p-3.5 hover:border-[#d4af37] hover:bg-[#faf8f0]"
                  >
                    <Icon size={17} />
                    <p className="mt-2 text-xs font-bold">{title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500">{description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px] bg-[#d4af37] p-6 text-[#18392b] shadow-sm">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[#18392b]/10" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392b] text-[#d4af37]">
                  <UsersRound size={20} />
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#18392b]/60">
                  Alumni Community
                </p>

                <h3 className="mt-1 font-serif text-2xl font-bold">Stay Connected</h3>

                <p className="mt-2 text-xs leading-5 text-[#18392b]/70">
                  Discover events, reconnect with classmates, and stay connected
                  with the growing BSA alumni community.
                </p>

                <Link
                  to="/dashboard/events"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#18392b] px-4 py-2.5 text-xs font-bold text-white"
                >
                  View Events
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-[22px] border border-[#ddd7c8] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                    Calendar
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold">Upcoming Events</h3>
                </div>

                <Link to="/dashboard/events" className="text-xs font-bold text-[#18392b]">
                  View all
                </Link>
              </div>

              <div className="mt-4 space-y-2.5">
                {events.map((event) => (
                  <div key={event.title} className="flex gap-3 rounded-xl border border-[#eee9dc] bg-[#fbfaf6] p-3.5">
                    <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#18392b] text-white">
                      <span className="text-[9px] font-bold tracking-wider text-[#d4af37]">{event.month}</span>
                      <span className="font-serif text-lg font-bold">{event.day}</span>
                    </div>
                    <div className="flex items-center">
                      <h4 className="text-sm font-semibold">{event.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#ddd7c8] bg-white p-5 shadow-sm sm:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a08f67]">
                  Account Activity
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold">Recent Activity</h3>
              </div>

              <div className="mt-3 divide-y divide-[#eee9dc]">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div key={activity.title} className="flex gap-3 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f6ef] text-[#18392b]">
                        <Icon size={14} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold">{activity.title}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <footer className="mt-7 border-t border-[#ddd7c8] pt-5">
            <div className="flex flex-col gap-1 text-[10px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>� 2026 PLM College of Accountancy Alumni System</p>
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
