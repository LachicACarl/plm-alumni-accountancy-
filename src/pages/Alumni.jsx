import plmCampus from "../assets/plm-campus.jpg";
import { useState } from "react";
import {
  Search,
  UserRound,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

const alumni = [
  {
    name: "Maria Santos",
    batch: "2025",
    profession: "Certified Public Accountant",
    company: "Accounting Professional",
    location: "Manila, Philippines",
  },
  {
    name: "John Reyes",
    batch: "2024",
    profession: "Audit Associate",
    company: "Professional Services",
    location: "Quezon City, Philippines",
  },
  {
    name: "Angela Cruz",
    batch: "2023",
    profession: "Financial Analyst",
    company: "Finance Professional",
    location: "Makati, Philippines",
  },
  {
    name: "Carlos Mendoza",
    batch: "2022",
    profession: "Senior Accountant",
    company: "Accounting Professional",
    location: "Pasig, Philippines",
  },
  {
    name: "Sofia Garcia",
    batch: "2021",
    profession: "Tax Associate",
    company: "Tax Professional",
    location: "Manila, Philippines",
  },
  {
    name: "Daniel Flores",
    batch: "2020",
    profession: "Internal Auditor",
    company: "Audit Professional",
    location: "Taguig, Philippines",
  },
];

const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

export default function Alumni() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");

  const filteredAlumni = alumni.filter((person) => {
    const query = search.toLowerCase();

    const matchesSearch =
      person.name.toLowerCase().includes(query) ||
      person.profession.toLowerCase().includes(query) ||
      person.company.toLowerCase().includes(query);

    const matchesBatch = batch === "All" || person.batch === batch;

    return matchesSearch && matchesBatch;
  });

  return (
    <PublicLayout>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#18392b] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${plmCampus})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#18392b] via-[#18392b]/95 to-[#18392b]/70" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
                PLM BSA ALUMNI
              </p>

              <h1 className="mt-4 font-serif text-6xl font-bold tracking-tight md:text-7xl">
                ALUMNI
              </h1>

              <div className="mt-6 h-1 w-20 bg-[#d4af37]" />

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">
                Discover the people who carry the PLM College of Accountancy
                tradition forward. Search, explore, and reconnect with fellow
                alumni across different batches and professions.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-[#f7f5ee] px-6 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="alumni-search"
                    className="mb-2 block text-sm font-semibold text-[#18392b]"
                  >
                    Search Alumni
                  </label>

                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="alumni-search"
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by name, profession, or company..."
                      className="w-full rounded-xl border border-[#d8d4c8] bg-[#faf9f5] py-3.5 pl-12 pr-4 text-sm text-[#18392b] outline-none transition placeholder:text-gray-400 focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>
                </div>

                <div className="lg:w-56">
                  <label
                    htmlFor="batch-filter"
                    className="mb-2 block text-sm font-semibold text-[#18392b]"
                  >
                    Filter by Batch
                  </label>

                  <select
                    id="batch-filter"
                    value={batch}
                    onChange={(event) => setBatch(event.target.value)}
                    className="w-full rounded-xl border border-[#d8d4c8] bg-[#faf9f5] px-4 py-3.5 text-sm text-[#18392b] outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                  >
                    <option value="All">All Batches</option>

                    {years.map((year) => (
                      <option key={year} value={year}>
                        Batch {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#eee9dc] pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#18392b]">
                    Alumni Directory
                  </p>

                  <p className="text-xs text-gray-500">
                    {filteredAlumni.length} member
                    {filteredAlumni.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directory */}
        <section className="bg-[#f7f5ee] px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                  THE BSA COMMUNITY
                </p>

                <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b]">
                  Meet Our Alumni
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                {filteredAlumni.length} result
                {filteredAlumni.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredAlumni.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAlumni.map((person) => (
                  <article
                    key={person.name}
                    className="group overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-2 bg-gradient-to-r from-[#d4af37] to-[#18392b]" />

                    <div className="p-7">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#eee9dc] bg-[#18392b] text-white">
                          <UserRound size={34} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif text-xl font-bold text-[#18392b]">
                            {person.name}
                          </h3>

                          <span className="mt-1 inline-block rounded-full bg-[#eee9dc] px-3 py-1 text-xs font-bold text-[#8d6d12]">
                            BSA Batch {person.batch}
                          </span>
                        </div>
                      </div>

                      <div className="mt-7 space-y-4 border-t border-[#eee9dc] pt-6">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e6] text-[#b28b1e]">
                            <GraduationCap size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Profession
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#18392b]">
                              {person.profession}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e6] text-[#b28b1e]">
                            <BriefcaseBusiness size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Organization
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#18392b]">
                              {person.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e6] text-[#b28b1e]">
                            <MapPin size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Location
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#18392b]">
                              {person.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#18392b] px-4 py-3 text-sm font-semibold text-[#18392b] transition hover:bg-[#18392b] hover:text-white"
                      >
                        View Profile
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#cfc8b8] bg-white px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 font-serif text-2xl font-bold text-[#18392b]">
                  No alumni found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try another name, profession, company, or batch.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setBatch("All");
                  }}
                  className="mt-6 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244d3b]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Community CTA */}
        <section className="border-y border-[#d9cfae] bg-[#eee9dc] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 rounded-3xl bg-[#18392b] p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#d4af37]">
                  STAY CONNECTED
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
                  Be part of the BSA alumni community.
                </h2>

                <p className="mt-3 leading-7 text-white/70">
                  Keep your profile updated and stay connected with classmates,
                  events, achievements, and the PLM College of Accountancy
                  community.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-6 py-3.5 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5"
              >
                Join the Alumni System
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#f7f5ee]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
            <div>
              <p className="font-serif text-2xl font-bold text-[#18392b]">
                BSA | ALUMNI SYSTEM
              </p>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                PLM College of Accountancy alumni community and digital
                connection platform.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#18392b]">
                Quick Links
              </p>

              <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500">
                <Link to="/" className="transition hover:text-[#18392b]">
                  Home
                </Link>

                <Link
                  to="/batches"
                  className="transition hover:text-[#18392b]"
                >
                  Batches
                </Link>

                <Link
                  to="/events"
                  className="transition hover:text-[#18392b]"
                >
                  Events
                </Link>

                <Link
                  to="/login"
                  className="transition hover:text-[#18392b]"
                >
                  Alumni Login
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#18392b]">
                Contact
              </p>

              <div className="mt-4 space-y-2 text-sm leading-6 text-gray-500">
                <p>PLM College of Accountancy</p>
                <p>Intramuros, Manila, Philippines</p>
                <p>accountancy@plm.edu.ph</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ddd7c8] bg-[#18392b] px-6 py-5 text-center text-xs text-white/60">
            Â© 2026 PLM College of Accountancy BSA Alumni System. All rights
            reserved.
          </div>
        </footer>
      </main>
    </PublicLayout>
  );
}
