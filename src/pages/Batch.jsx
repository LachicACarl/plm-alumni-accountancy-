import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  GraduationCap,
  MapPin,
  Users,
  BriefcaseBusiness,
  Trophy,
  UserRound,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Batch() {
  const members = [
    {
      name: "Maria Santos",
      role: "Certified Public Accountant",
      company: "Santos & Associates",
    },
    {
      name: "John Reyes",
      role: "Financial Analyst",
      company: "Metro Finance Corp.",
    },
    {
      name: "Angela Cruz",
      role: "Audit Associate",
      company: "SGV & Co.",
    },
    {
      name: "Carlos Mendoza",
      role: "Accountant",
      company: "Mendoza Accounting Services",
    },
    {
      name: "Sofia Garcia",
      role: "Tax Consultant",
      company: "Garcia Tax Solutions",
    },
    {
      name: "Daniel Flores",
      role: "Internal Auditor",
      company: "PLM Alumni Corporation",
    },
  ];

  const initials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#18392b] transition hover:text-[#b28b1e]"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b806b]">
              Alumni Portal
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold text-[#18392b]">
              My Batch
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Connect with your fellow BSA Batch 2025 alumni and stay connected
              with your graduating community.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          {/* Batch Hero */}
          <section className="relative overflow-hidden rounded-3xl bg-[#18392b] text-white shadow-sm">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 right-20 h-64 w-64 rounded-full border border-[#d4af37]/20" />

            <div className="relative p-7 lg:p-9">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
                    BSA Alumni Batch
                  </p>

                  <h2 className="mt-2 font-serif text-6xl font-bold tracking-tight">
                    2025
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                    A community of Bachelor of Science in Accountancy graduates
                    continuing their professional journey together.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <Users size={16} className="text-[#d4af37]" />
                      68 Alumni
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} className="text-[#d4af37]" />
                      Graduated May 2025
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} className="text-[#d4af37]" />
                      Manila, Philippines
                    </span>
                  </div>
                </div>

                <div className="flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-full border-4 border-[#d4af37]/40 bg-white/10 lg:self-center">
                  <GraduationCap size={48} className="text-[#d4af37]" />
                </div>
              </div>
            </div>

            <div className="relative grid border-t border-white/10 sm:grid-cols-3">
              <div className="p-5 lg:px-7">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[#d4af37]" />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      Members
                    </p>

                    <p className="mt-1 font-serif text-2xl font-bold">68</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0 lg:px-7">
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-[#d4af37]" />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      CPA Passers
                    </p>

                    <p className="mt-1 font-serif text-2xl font-bold">24</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0 lg:px-7">
                <div className="flex items-center gap-3">
                  <UserRound size={18} className="text-[#d4af37]" />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      Active Alumni
                    </p>

                    <p className="mt-1 font-serif text-2xl font-bold">61</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Batch Overview */}
          <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm lg:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                  <GraduationCap size={24} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                    About Your Batch
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    BSA Batch 2025
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    Your batch connects graduates from the PLM College of
                    Accountancy who completed the Bachelor of Science in
                    Accountancy program in 2025.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#ddd7c8] bg-[#fbfaf6] p-6 shadow-sm lg:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                Batch Highlights
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#18392b]">
                    <Award size={17} />
                  </span>

                  <span className="text-sm font-medium text-gray-600">
                    24 CPA passers
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#18392b]">
                    <BriefcaseBusiness size={17} />
                  </span>

                  <span className="text-sm font-medium text-gray-600">
                    Professional alumni network
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#18392b]">
                    <Users size={17} />
                  </span>

                  <span className="text-sm font-medium text-gray-600">
                    61 active alumni
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Members */}
          <section className="mt-9">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Your Community
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Batch Members
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Meet the alumni who graduated with you.
                </p>
              </div>

              <span className="text-sm font-medium text-gray-500">
                Showing 6 of 68 alumni
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member, index) => (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#d4af37] to-[#18392b]" />

                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eee9dc] font-serif text-lg font-bold text-[#18392b]">
                        {initials(member.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-lg font-bold text-[#18392b]">
                          {member.name}
                        </h3>

                        <span className="mt-1 inline-flex rounded-full bg-[#f7f5ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8b806b]">
                          BSA Batch 2025
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-[#eee9dc] pt-4">
                      <div className="flex items-start gap-3">
                        <BriefcaseBusiness
                          size={16}
                          className="mt-0.5 shrink-0 text-[#b28b1e]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {member.role}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {member.company}
                          </p>
                        </div>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#eef5ef] px-3 py-1.5 text-xs font-bold text-[#286044]">
                        <Award size={13} />
                        You
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Stay Connected */}
          <section className="relative mt-9 overflow-hidden rounded-3xl bg-[#18392b] p-7 text-white shadow-sm lg:p-8">
            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  Stay Connected
                </p>

                <h3 className="mt-1 font-serif text-2xl font-bold">
                  Keep in touch with your batch
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  Join upcoming alumni events, reconnect with classmates, and
                  continue building your professional community.
                </p>
              </div>

              <Link
                to="/dashboard/events"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-6 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5"
              >
                View Batch Events
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
