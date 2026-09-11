import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

const managementCards = [
  {
    title: "Alumni Management",
    description: "Search, review, and manage registered BSA alumni records.",
    count: "500+",
    label: "Alumni Records",
    icon: Users,
    path: "/admin/alumni",
  },
  {
    title: "Credential Verification",
    description: "Review and verify credentials submitted by alumni.",
    count: "3",
    label: "Pending Reviews",
    icon: FileCheck2,
    path: "/admin/credentials",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="border-b border-[#d8d2c2] bg-[#18392b] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#d4af37]">
                PLM ACCOUNTANCY
              </p>
              <p className="text-sm font-bold">BSA Alumni Admin</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <ShieldCheck size={19} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-3xl bg-[#18392b] text-white shadow-xl">
          <div className="grid gap-8 px-7 py-10 md:grid-cols-[1.5fr_1fr] md:px-10 md:py-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Administration Portal
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Welcome, Admin
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                Manage the PLM College of Accountancy BSA Alumni System,
                alumni records, credentials, achievements, and community
                information from one central dashboard.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#d4af37]/30 bg-white/5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
                  <GraduationCap size={46} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Alumni
            </p>
            <p className="mt-2 text-3xl font-bold">500+</p>
            <p className="mt-2 text-xs text-emerald-600">
              Registered members
            </p>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Batches
            </p>
            <p className="mt-2 text-3xl font-bold">8</p>
            <p className="mt-2 text-xs text-slate-500">
              2019–2026
            </p>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Credentials
            </p>
            <p className="mt-2 text-3xl font-bold text-[#9a7b16]">3</p>
            <p className="mt-2 text-xs text-amber-600">
              Requires review
            </p>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Events
            </p>
            <p className="mt-2 text-3xl font-bold">4</p>
            <p className="mt-2 text-xs text-slate-500">
              Alumni activities
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7b16]">
              Management
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">
              System Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
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
                  className="group rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#18392b] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18392b]/10 text-[#18392b]">
                      <Icon size={24} />
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#18392b]"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between border-t border-[#eee9df] pt-5">
                    <div>
                      <p className="text-2xl font-bold">{card.count}</p>
                      <p className="text-xs text-slate-400">
                        {card.label}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-[#9a7b16]">
                      Manage
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Quick Links</h2>
              <p className="mt-1 text-sm text-slate-500">
                Access the public alumni website or return to the admin
                login.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-xl border border-[#d8d2c2] px-4 py-2.5 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee]"
              >
                Public Website
              </Link>

              <Link
                to="/admin/login"
                className="rounded-xl bg-[#18392b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#24513d]"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
