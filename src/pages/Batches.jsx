import plmCampus from "../assets/plm-campus.jpg";
import batchImage from "../assets/1.jpg";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Users,
  Award,
  BriefcaseBusiness,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
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

const members = [
  {
    name: "Alumni Member 1",
    role: "Certified Public Accountant",
  },
  {
    name: "Alumni Member 2",
    role: "Accounting Professional",
  },
  {
    name: "Alumni Member 3",
    role: "Finance Professional",
  },
  {
    name: "Alumni Member 4",
    role: "Business Professional",
  },
];

export default function Batches() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const batch = batches[selectedYear];

  return (
    <PublicLayout>
      <main className="bg-[#fbfaf5]">
        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="relative isolate h-[245px] overflow-hidden sm:h-[270px]">
          <img
            src={plmCampus}
            alt="Pamantasan ng Lungsod ng Maynila campus"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#102b1f]/95 via-[#18392b]/82 to-[#18392b]/45" />

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#d4af37]/20" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="h-[3px] w-12 rounded-full bg-[#d4af37]" />

                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e3c55e]">
                  PLM BSA ALUMNI
                </p>
              </div>

              <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.95] text-white sm:text-6xl md:text-7xl">
                Batches
              </h1>

              <p className="mt-6 max-w-2xl font-serif text-lg leading-8 text-white/80 md:text-xl">
                Explore the generations of PLM Bachelor of Science in
                Accountancy graduates and discover the stories that connect us.
              </p>

              <div className="mt-8 flex items-center gap-2">
                <div className="h-[3px] w-20 rounded-full bg-[#d4af37]" />
                <div className="h-[3px] w-10 rounded-full bg-white/35" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            YEAR SELECTOR
            ===================================================== */}
        <section className="border-y border-[#ded8c9] bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto px-6 md:px-10 lg:px-12">
            <div className="flex min-w-max items-center gap-2 py-4">
              <div className="mr-3 hidden items-center gap-2 border-r border-[#ded8c9] pr-5 sm:flex">
                <CalendarDays size={17} className="text-[#b28b1e]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#68736c]">
                  Batch Year
                </span>
              </div>

              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                    selectedYear === year
                      ? "bg-[#18392b] text-white shadow-md"
                      : "text-[#657069] hover:bg-[#eef2e9] hover:text-[#28583e]"
                  }`}
                >
                  {year}

                  {selectedYear === year && (
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#d4af37]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SELECTED BATCH
            ===================================================== */}
        <section className="bg-[#fbfaf5] px-6 py-12 md:px-10 lg:px-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b28b1e]">
              Explore a Generation
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b] md:text-5xl">
              {batch.title}
            </h2>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-[3px] w-14 rounded-full bg-[#d4af37]" />
              <div className="h-[3px] w-8 rounded-full bg-[#719878]/60" />
            </div>
          </div>

          <div className="grid overflow-hidden rounded-[24px] border border-[#ded8c9] bg-white shadow-[0_12px_38px_rgba(24,57,43,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Batch photo */}
            <div className="relative min-h-[350px] overflow-hidden bg-[#18392b] lg:min-h-[500px]">
              <img
                src={batchImage}
                alt={`${batch.title} alumni`}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102b1f]/90 via-[#18392b]/25 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e3c55e]">
                  PLM College of Accountancy
                </p>

                <p className="mt-2 font-serif text-3xl font-bold text-white">
                  {selectedYear}
                </p>
              </div>
            </div>

            {/* Batch details */}
            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0e5] text-[#315f45]">
                <GraduationCap size={29} strokeWidth={1.6} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                About This Batch
              </p>

              <h3 className="mt-2 font-serif text-3xl font-bold text-[#18392b] md:text-4xl">
                A legacy worth celebrating
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#68736c]">
                {batch.description}
              </p>

              <div className="mt-7 flex items-center gap-4 rounded-2xl border border-[#e5dfd0] bg-[#fbfaf5] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18392b] text-white">
                  <Users size={21} />
                </div>

                <div>
                  <p className="font-serif text-2xl font-bold text-[#18392b]">
                    {batch.members}
                  </p>
                  <p className="text-xs font-medium text-[#758078]">
                    Registered alumni
                  </p>
                </div>

                <div className="ml-auto hidden h-10 w-px bg-[#ded8c9] sm:block" />

                <div className="hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#b28b1e]">
                    Batch
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#18392b]">
                    {selectedYear}
                  </p>
                </div>
              </div>

              <Link
                to="/alumni"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b84c] to-[#65966d] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Meet the Alumni
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* =================================================
              HIGHLIGHTS
              ================================================= */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">
                Batch Highlights
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b] md:text-4xl">
                Celebrating their journey
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#68736c]">
                Every batch carries a unique story shaped by friendships,
                achievements, professional growth, and the values learned at
                PLM.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {batch.highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="group rounded-2xl border border-[#ded8c9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4ce] text-[#b28b1e]">
                    {index === 0 ? (
                      <Award size={21} />
                    ) : index === 1 ? (
                      <BriefcaseBusiness size={21} />
                    ) : (
                      <Users size={21} />
                    )}
                  </div>

                  <p className="mt-5 text-sm font-bold leading-6 text-[#18392b]">
                    {highlight}
                  </p>

                  <div className="mt-4 h-px w-8 bg-[#d4af37] transition-all group-hover:w-14" />
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              MEMBERS
              ================================================= */}
          <div className="mt-16 border-t border-[#e3ddcf] pt-14">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">
                  Batch Members
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b] md:text-4xl">
                  Meet the Alumni
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68736c]">
                  A growing community of graduates connected by the PLM BSA
                  experience.
                </p>
              </div>

              <Link
                to="/alumni"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#315f45] transition hover:text-[#b28b1e]"
              >
                View Alumni Directory
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member, index) => (
                <article
                  key={member.name}
                  className="group rounded-[20px] border border-[#ded8c9] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative mx-auto h-24 w-24">
                    <img
                      src={batchImage}
                      alt=""
                      className="h-24 w-24 rounded-full border-4 border-[#f1ead9] object-cover"
                    />

                    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#18392b] text-[10px] font-bold text-[#d4af37]">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-lg font-bold text-[#18392b]">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#78817b]">
                    {member.role}
                  </p>

                  <button
                    type="button"
                    className="mt-5 text-xs font-bold uppercase tracking-[0.1em] text-[#315f45] transition hover:text-[#b28b1e]"
                  >
                    View Profile
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            COMMUNITY STRIP
            ===================================================== */}
        <section className="bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center sm:flex-row sm:text-left md:px-10 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7b1d]">
                One Community. One Legacy.
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Discover the people behind every batch.
              </h2>
            </div>

            <Link
              to="/alumni"
              className="inline-flex items-center gap-2 rounded-xl border border-[#b79a3b] bg-white/70 px-5 py-3 text-xs font-bold text-[#315f45] transition hover:bg-white"
            >
              Alumni Directory
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}
        <footer className="border-t border-[#ded8c9] bg-[#f8f5ec]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-12">
            <div>
              <p className="text-3xl font-serif font-bold tracking-[0.12em] text-[#18392b]">BSA</p>
              <p className="text-3xl font-serif font-bold tracking-[0.12em] text-[#d4af37]">ALUMNI</p>
              <p className="text-3xl font-serif font-bold tracking-[0.12em] text-[#18392b]">SYSTEM</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#59645c]">
                Strengthening connections. Honoring our legacy. Building the future together.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#315f45]">
                Contact Us
              </p>

              <div className="mt-5 space-y-4 text-sm text-[#59645c]">
                <p className="flex gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>
                    General Luna corner Muralla Streets,
                    <br />
                    Intramuros, Manila, 1002 Metro Manila
                  </span>
                </p>

                <p className="flex gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>BSAAlumniSystem.2026@gmail.com</span>
                </p>

                <p className="flex gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>(02) 1234-5678 / 09123456789</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#18392b] px-6 py-4 text-center text-xs text-white/75">
            © BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila. All Rights Reserved.
          </div>
        </footer>      </main>
    </PublicLayout>
  );
}









