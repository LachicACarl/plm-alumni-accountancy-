import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  GraduationCap,
  MapPin,
  Menu,
  Users,
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

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5">
          <div>
            <Link
              to="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm text-[#18392b] hover:underline"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <h1 className="font-serif text-3xl font-bold text-[#18392b]">
              My Batch
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Connect with your fellow BSA Batch 2025 alumni.
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <section className="overflow-hidden rounded-2xl bg-[#18392b] text-white shadow-sm">
            <div className="p-7 lg:p-9">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                    BSA Alumni Batch
                  </p>

                  <h2 className="mt-2 font-serif text-5xl font-bold">
                    2025
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <Users size={16} />
                      68 Alumni
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} />
                      Graduated May 2025
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} />
                      Manila, Philippines
                    </span>
                  </div>
                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#d4af37]/40 bg-white/10">
                  <GraduationCap size={42} className="text-[#d4af37]" />
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/10 sm:grid-cols-3">
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Members
                </p>
                <p className="mt-1 text-xl font-bold">68</p>
              </div>

              <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  CPA Passers
                </p>
                <p className="mt-1 text-xl font-bold">24</p>
              </div>

              <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Active Alumni
                </p>
                <p className="mt-1 text-xl font-bold">61</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                  Your Community
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Batch Members
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                Showing 6 of 68
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member, index) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eee9dc] font-serif text-lg font-bold text-[#18392b]">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#18392b]">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        BSA Batch 2025
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700">
                      {member.role}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {member.company}
                    </p>
                  </div>

                  {index === 0 && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#eef5ef] px-3 py-1 text-xs font-semibold text-[#18392b]">
                      <Award size={13} />
                      You
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#18392b]">
                  Stay Connected
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Join upcoming alumni events and reconnect with your batch.
                </p>
              </div>

              <Link
                to="/dashboard/events"
                className="inline-flex items-center justify-center rounded-lg bg-[#18392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24513d]"
              >
                View Batch Events
              </Link>
            </div>
          </section>

          <button className="mt-5 rounded-lg border border-gray-300 p-3 sm:hidden">
            <Menu size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
