import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  ChevronRight,
  Trophy,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  Star,
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
      icon: BriefcaseBusiness,
    },
    {
      title: "Outstanding Alumni Award",
      category: "Recognition",
      date: "August 2025",
      description:
        "Recognized for outstanding professional achievement and contribution to the accountancy community.",
      icon: Trophy,
    },
    {
      title: "Academic Excellence Award",
      category: "Academic",
      date: "May 2025",
      description:
        "Awarded for maintaining excellent academic performance throughout the BSA program.",
      icon: GraduationCap,
    },
    {
      title: "Leadership Excellence Award",
      category: "Leadership",
      date: "March 2025",
      description:
        "Recognized for leadership and active participation in student organizations.",
      icon: Users,
    },
    {
      title: "Dean's Lister",
      category: "Academic",
      date: "2024",
      description:
        "Included in the Dean's List for outstanding academic performance.",
      icon: Star,
    },
  ];

  const categoryCounts = {
    Academic: achievements.filter((item) => item.category === "Academic").length,
    Professional: achievements.filter(
      (item) => item.category === "Professional"
    ).length,
    Recognition: achievements.filter(
      (item) => item.category === "Recognition"
    ).length,
    Leadership: achievements.filter(
      (item) => item.category === "Leadership"
    ).length,
  };

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
              My Achievements
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View your academic, professional, leadership, and community
              achievements.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          {/* Recognition Hero */}
          <section className="overflow-hidden rounded-3xl bg-[#18392b] shadow-sm">
            <div className="relative p-7 lg:p-8">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute -bottom-24 right-12 h-48 w-48 rounded-full border border-[#d4af37]/20" />

              <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37] text-[#18392b]">
                    <Trophy size={27} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      Your Recognition
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                      {achievements.length} Achievements
                    </h2>

                    <p className="mt-2 text-sm text-white/60">
                      A record of your accomplishments as a PLM Accountancy
                      alumnus.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/10 px-7 py-5 text-center backdrop-blur-sm">
                  <p className="font-serif text-3xl font-bold text-[#d4af37]">
                    2025
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Most Recent
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Achievement Summary */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                  <Award size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Total
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {achievements.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5ef] text-[#18392b]">
                  <GraduationCap size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Academic
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {categoryCounts.Academic}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7df] text-[#a07810]">
                  <BriefcaseBusiness size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Professional
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {categoryCounts.Professional}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2eee5] text-[#18392b]">
                  <Trophy size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Recognition
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {categoryCounts.Recognition}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement List */}
          <section className="mt-8">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                Accomplishments
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Your Achievement Record
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your academic and professional milestones are displayed below.
              </p>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;

                return (
                  <article
                    key={achievement.title}
                    className="group rounded-3xl border border-[#ddd7c8] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md lg:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                        <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/30" />
                        <Icon size={25} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#18392b]">
                              {achievement.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-[#eef5ef] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#286044]">
                                {achievement.category}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                <CalendarDays size={13} />
                                {achievement.date}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#18392b] transition hover:text-[#b28b1e]"
                          >
                            View
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-500">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Submit Achievement */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-8 text-center lg:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
              <Award size={28} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
              Keep Your Profile Updated
            </p>

            <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
              Have a new achievement?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Submit your latest academic, professional, leadership, or
              community achievement for your alumni profile.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-6 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5"
            >
              <Award size={17} />
              Submit Achievement
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
