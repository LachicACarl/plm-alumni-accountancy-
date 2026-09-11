import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  FileCheck2,
  Menu,
  UserRound,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = [
    {
      label: "Profile Status",
      value: "Complete",
      icon: UserRound,
    },
    {
      label: "Credentials",
      value: "3",
      icon: FileCheck2,
    },
    {
      label: "Achievements",
      value: "5",
      icon: Award,
    },
    {
      label: "Events",
      value: "2",
      icon: CalendarDays,
    },
  ];

  const activities = [
    {
      title: "Profile information updated",
      date: "June 5, 2026",
    },
    {
      title: "Credential submitted for verification",
      date: "May 28, 2026",
    },
    {
      title: "Achievement added to your profile",
      date: "May 20, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#ddd7c8] bg-white/95 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-[#ddd7c8] p-2 text-[#18392b] lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu size={22} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                  Alumni Portal
                </p>
                <h1 className="font-serif text-2xl font-bold text-[#18392b]">
                  Dashboard
                </h1>
              </div>
            </div>

            <Link
              to="/"
              className="hidden text-sm font-medium text-[#18392b] hover:underline sm:block"
            >
              Back to Website
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <section className="rounded-2xl bg-[#18392b] p-7 text-white shadow-sm md:p-9">
            <p className="text-sm font-semibold tracking-[0.18em] text-[#d4af37]">
              WELCOME BACK
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              Maria Santos
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-white/70">
              Welcome to your BSA Alumni account. Keep your profile,
              credentials, achievements, and alumni information up to date.
            </p>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#18392b]">
                        {stat.value}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <Icon size={21} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-7 grid gap-7 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                    Your Information
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    My Profile
                  </h3>
                </div>

                <Link
                  to="/dashboard/profile"
                  className="text-sm font-semibold text-[#18392b] hover:underline"
                >
                  View profile
                </Link>
              </div>

              <div className="mt-6 flex flex-col gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                  <UserRound size={34} />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-[#18392b]">
                    Maria Santos
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    BSA Batch 2025
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Certified Public Accountant
                  </p>
                </div>

                <div className="sm:ml-auto">
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Profile Complete
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#d4af37] p-7 text-[#18392b] shadow-sm">
              <Award size={30} />

              <h3 className="mt-5 font-serif text-2xl font-bold">
                Stay Connected
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#18392b]/75">
                Discover upcoming events and reconnect with fellow BSA
                alumni.
              </p>

              <Link
                to="/dashboard/events"
                className="mt-6 inline-flex rounded-lg bg-[#18392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24513d]"
              >
                View Events
              </Link>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                  Account Activity
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Recent Activity
                </h3>
              </div>
            </div>

            <div className="mt-6 divide-y divide-gray-100">
              {activities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {activity.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {activity.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
