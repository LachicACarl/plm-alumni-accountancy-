import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  ChevronRight,
  Menu,
  Trophy,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Achievements() {
  const achievements = [
    {
      title: "CPA Licensure Examination Passer",
      category: "Professional",
      date: "October 2025",
      description:
        "Successfully passed the Certified Public Accountant Licensure Examination.",
    },
    {
      title: "Outstanding Alumni Award",
      category: "Recognition",
      date: "August 2025",
      description:
        "Recognized for outstanding professional achievement and contribution to the accountancy community.",
    },
    {
      title: "Academic Excellence Award",
      category: "Academic",
      date: "May 2025",
      description:
        "Awarded for maintaining excellent academic performance throughout the BSA program.",
    },
    {
      title: "Leadership Excellence Award",
      category: "Leadership",
      date: "March 2025",
      description:
        "Recognized for leadership and active participation in student organizations.",
    },
    {
      title: "Dean's Lister",
      category: "Academic",
      date: "2024",
      description:
        "Included in the Dean's List for outstanding academic performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm text-[#18392b] hover:underline"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <h1 className="font-serif text-3xl font-bold text-[#18392b]">
                My Achievements
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View your academic, professional, and community achievements.
              </p>
            </div>

            <button className="rounded-lg border border-gray-300 p-3 sm:hidden">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="mb-8 rounded-2xl bg-[#18392b] p-6 text-white shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
                  <Trophy size={26} />
                </div>

                <div>
                  <p className="text-sm text-white/60">
                    Your Recognition
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    5 Achievements
                  </h2>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-center">
                <p className="text-2xl font-bold text-[#d4af37]">2025</p>
                <p className="text-xs text-white/60">
                  Most Recent
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="group rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                    <Award size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-[#18392b]">
                          {achievement.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="rounded-full bg-[#eef5ef] px-3 py-1 font-medium text-[#18392b]">
                            {achievement.category}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {achievement.date}
                          </span>
                        </div>
                      </div>

                      <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#18392b] opacity-0 transition group-hover:opacity-100">
                        View
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
              <Award size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-[#18392b]">
              Have a new achievement?
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Keep your alumni profile updated by submitting your latest
              academic, professional, or community achievements.
            </p>

            <button className="mt-5 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:bg-[#c39e2f]">
              Submit Achievement
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
