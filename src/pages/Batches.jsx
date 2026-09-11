import { useState } from "react";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";

const batches = {
  2026: {
    title: "BSA Batch 2026",
    description:
      "Celebrating the newest generation of Bachelor of Science in Accountancy graduates.",
    members: 68,
    highlights: ["New graduates", "CPA reviewees", "Young professionals"],
  },
  2025: {
    title: "BSA Batch 2025",
    description:
      "A proud community of graduates beginning their professional accounting journey.",
    members: 72,
    highlights: ["CPA passers", "Industry professionals", "Entrepreneurs"],
  },
  2024: {
    title: "BSA Batch 2024",
    description:
      "Alumni continuing the PLM tradition of excellence in accounting and business.",
    members: 64,
    highlights: ["CPA passers", "Corporate professionals", "Public accountants"],
  },
  2023: {
    title: "BSA Batch 2023",
    description:
      "A growing network of Accountancy graduates making an impact in different fields.",
    members: 59,
    highlights: ["CPA passers", "Finance professionals", "Business owners"],
  },
  2022: {
    title: "BSA Batch 2022",
    description:
      "Connecting graduates and celebrating their accomplishments after PLM.",
    members: 61,
    highlights: ["CPA passers", "Auditors", "Accounting professionals"],
  },
  2021: {
    title: "BSA Batch 2021",
    description:
      "Alumni building meaningful careers while carrying the PLM values forward.",
    members: 55,
    highlights: ["Industry leaders", "CPA passers", "Entrepreneurs"],
  },
  2020: {
    title: "BSA Batch 2020",
    description:
      "A resilient batch whose graduates continue to grow professionally.",
    members: 52,
    highlights: ["CPA passers", "Accountants", "Business professionals"],
  },
  2019: {
    title: "BSA Batch 2019",
    description:
      "One of the established BSA alumni communities connecting generations of graduates.",
    members: 49,
    highlights: ["CPA passers", "Senior professionals", "Business leaders"],
  },
};

const years = Object.keys(batches);

export default function Batches() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const batch = batches[selectedYear];

  return (
    <PublicLayout>
      <main>
        <section className="bg-[#18392b] px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
              PLM BSA ALUMNI
            </p>

            <h1 className="mt-3 font-serif text-6xl font-bold md:text-7xl">
              BATCHES
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Explore the different generations of PLM Bachelor of Science in
              Accountancy graduates and reconnect with your batch.
            </p>
          </div>
        </section>

        <section className="border-b border-[#ddd7c8] bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto px-6">
            <div className="flex min-w-max gap-2 py-5">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
                    selectedYear === year
                      ? "bg-[#18392b] text-white"
                      : "text-gray-600 hover:bg-[#eee9dc]"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-8 shadow-sm md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#18392b]/10 text-[#18392b]">
                <GraduationCap size={28} />
              </div>

              <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                SELECTED BATCH
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b]">
                {batch.title}
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-gray-600">
                {batch.description}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-xl font-bold text-[#18392b]">
                    {batch.members}
                  </p>
                  <p className="text-sm text-gray-500">Registered alumni</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#eee9dc] p-8 md:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                BATCH HIGHLIGHTS
              </p>

              <div className="mt-6 space-y-3">
                {batch.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center justify-between rounded-xl bg-white px-5 py-4"
                  >
                    <span className="font-medium text-[#18392b]">
                      {highlight}
                    </span>

                    <ArrowRight size={17} className="text-[#b28b1e]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                  BATCH MEMBERS
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b]">
                  Meet the Alumni
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Alumni Member",
                "Accountancy Graduate",
                "PLM BSA Professional",
                "BSA Alumni",
              ].map((role, index) => (
                <div
                  key={`${role}-${index}`}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                    <Users size={30} />
                  </div>

                  <h3 className="mt-5 font-semibold text-[#18392b]">
                    Alumni Member {index + 1}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">{role}</p>

                  <button className="mt-5 text-sm font-semibold text-[#18392b] hover:text-[#b28b1e]">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
