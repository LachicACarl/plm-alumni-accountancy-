import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Users,
  CalendarDays,
  Activity,
  Database,
  ExternalLink,
} from "lucide-react";

const managementCards = [
  {
    title: "Alumni Management",
    description:
      "Search, review, and manage registered BSA alumni records.",
    count: "500+",
    label: "Alumni Records",
    icon: Users,
    path: "/admin/alumni",
  },
  {
    title: "Credential Verification",
    description:
      "Review and verify credentials submitted by alumni.",
    count: "3",
    label: "Pending Reviews",
    icon: FileCheck2,
    path: "/admin/credentials",
  },
];

const statistics = [
  {
    label: "Total Alumni",
    value: "500+",
    description: "Registered members",
    icon: Users,
  },
  {
    label: "Batches",
    value: "8",
    description: "2019–2026",
    icon: GraduationCap,
  },
  {
    label: "Pending Credentials",
    value: "3",
    description: "Requires review",
    icon: FileCheck2,
  },
  {
    label: "Active Events",
    value: "4",
    description: "Alumni activities",
    icon: CalendarDays,
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-[#315442] bg-[#18392b] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b] shadow-sm">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                PLM College of Accountancy
              </p>

              <p className="font-serif text-base font-bold">
                BSA Alumni Administration
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-white/50">System Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <ShieldCheck size={19} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Welcome Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#18392b] text-white shadow-sm">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 right-20 h-64 w-64 rounded-full border border-[#d4af37]/20" />

          <div className="relative grid gap-8 px-7 py-9 md:grid-cols-[1.5fr_1fr] md:px-10 md:py-11">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
                Administration Portal
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Welcome, Admin
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                Manage the PLM College of Accountancy BSA Alumni System,
                including alumni records, credential verification, and
                community information from one central dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/admin/alumni"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5 hover:bg-[#e0be4b]"
                >
                  Manage Alumni
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/admin/credentials"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Review Credentials
                </Link>
              </div>
            </div>

            <div className="hidden items-center justify-center md:flex">
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[#d4af37]/25 bg-white/5">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b] shadow-lg">
                  <GraduationCap size={52} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b806b]">
                      {stat.label}
                    </p>

                    <p className="mt-2 font-serif text-3xl font-bold text-[#18392b]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b] transition group-hover:bg-[#d4af37]">
                    <Icon size={19} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Management */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28b1e]">
              Management
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold md:text-3xl">
              System Management
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select a module to manage the alumni system.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group relative overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b8aa7d] hover:shadow-md"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#d4af37] to-[#18392b]" />

                  <div className="p-6 lg:p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                        <Icon size={25} />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee9dc] text-gray-400 transition group-hover:border-[#d4af37] group-hover:text-[#18392b]">
                        <ArrowRight
                          size={17}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>

                    <h3 className="mt-5 font-serif text-xl font-bold text-[#18392b]">
                      {card.title}
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                      {card.description}
                    </p>

                    <div className="mt-6 flex items-end justify-between border-t border-[#eee9df] pt-5">
                      <div>
                        <p className="font-serif text-2xl font-bold text-[#18392b]">
                          {card.count}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          {card.label}
                        </p>
                      </div>

                      <span className="text-sm font-bold text-[#b28b1e] transition group-hover:text-[#18392b]">
                        Manage
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* System Status */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28b1e]">
              System Overview
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold">
              Administration Status
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5ef] text-[#286044]">
                  <Activity size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Portal Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#286044]">
                    Operational
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                  <Database size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Data Management
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#18392b]">
                    Alumni Records
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7df] text-[#a07810]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Security
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#18392b]">
                    Admin Access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-10 rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm lg:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                Quick Access
              </p>

              <h2 className="mt-1 font-serif text-xl font-bold">
                Useful Links
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Access the public alumni website or return to the administrator
                login page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d8d2c2] px-4 py-2.5 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee]"
              >
                Public Website
                <ExternalLink size={15} />
              </Link>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#18392b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#24513d]"
              >
                Admin Login
                <ShieldCheck size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#ddd7c8] pt-7 pb-3">
          <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 PLM College of Accountancy — BSA Alumni System
            </p>

            <p>
              Administration Portal
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
