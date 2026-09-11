import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  UserRound,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Profile Status",
      value: "Complete",
      icon: UserRound,
      description: "Your profile is up to date",
    },
    {
      label: "Credentials",
      value: "3",
      icon: FileCheck2,
      description: "Verified credentials",
    },
    {
      label: "Achievements",
      value: "5",
      icon: Award,
      description: "Recorded achievements",
    },
    {
      label: "Events",
      value: "2",
      icon: CalendarDays,
      description: "Upcoming events",
    },
  ];

  const activities = [
    {
      title: "Profile information updated",
      date: "June 10, 2026",
      icon: UserRound,
    },
    {
      title: "Credential verified",
      date: "June 5, 2026",
      icon: FileCheck2,
    },
    {
      title: "Achievement added",
      date: "May 28, 2026",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <header className="bg-[#18392b] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
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
          </div>

          <Link
            to="/"
            className="text-sm font-medium text-white/80 transition hover:text-[#d4af37]"
          >
            Back to website
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b28d21]">
            BSA Alumni System
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#18392b]">
            Welcome back, Maria.
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your alumni profile, credentials, achievements, and
            community activities.
          </p>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
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

                <p className="mt-4 text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#b28d21]">
                  My Profile
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Maria Santos
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                <UserRound size={28} />
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Batch
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  BSA Batch 2025
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Profession
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  Certified Public Accountant
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  maria.santos@example.com
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Profile Status
                </p>
                <p className="mt-1 font-medium text-green-700">
                  Complete
                </p>
              </div>
            </div>

            <button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#18392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24513d]">
              Edit Profile
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="rounded-2xl bg-[#18392b] p-7 text-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={24} />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold">
              Stay Connected
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/70">
              Keep in touch with fellow BSA graduates and stay updated with
              alumni activities, events, and announcements.
            </p>

            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#18392b] transition hover:bg-[#f3efe4]"
            >
              View Events
              <ChevronRight size={17} />
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#b28d21]">
                Recent Activity
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Your latest updates
              </h2>
            </div>
          </div>

          <div className="mt-6 divide-y divide-gray-100">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
