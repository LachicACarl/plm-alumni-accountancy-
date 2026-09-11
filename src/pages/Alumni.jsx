import { Search, UserRound, MapPin, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { useState } from "react";
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

export default function Alumni() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.profession.toLowerCase().includes(search.toLowerCase()) ||
      person.company.toLowerCase().includes(search.toLowerCase());

    const matchesBatch = batch === "All" || person.batch === batch;

    return matchesSearch && matchesBatch;
  });

  return (
    <PublicLayout>
      <main>
        <section className="bg-[#18392b] px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
              PLM BSA ALUMNI
            </p>

            <h1 className="mt-3 font-serif text-6xl font-bold md:text-7xl">
              ALUMNI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Search and reconnect with graduates of the PLM College of
              Accountancy.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search alumni by name, profession, or company..."
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-[#18392b]"
                />
              </div>

              <select
                value={batch}
                onChange={(event) => setBatch(event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#18392b]"
              >
                <option value="All">All Batches</option>
                {["2025", "2024", "2023", "2022", "2021", "2020"].map(
                  (year) => (
                    <option key={year} value={year}>
                      Batch {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                ALUMNI DIRECTORY
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b]">
                Alumni Members
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {filteredAlumni.length} result
              {filteredAlumni.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredAlumni.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAlumni.map((person) => (
                <article
                  key={person.name}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
                      <UserRound size={28} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-serif text-xl font-bold text-[#18392b]">
                        {person.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#b28b1e]">
                        BSA Batch {person.batch}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-[#eee9dc] pt-5">
                    <div className="flex gap-3 text-sm text-gray-600">
                      <GraduationCap
                        size={17}
                        className="mt-0.5 shrink-0 text-[#b28b1e]"
                      />
                      <span>{person.profession}</span>
                    </div>

                    <div className="flex gap-3 text-sm text-gray-600">
                      <BriefcaseBusiness
                        size={17}
                        className="mt-0.5 shrink-0 text-[#b28b1e]"
                      />
                      <span>{person.company}</span>
                    </div>

                    <div className="flex gap-3 text-sm text-gray-600">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-[#b28b1e]"
                      />
                      <span>{person.location}</span>
                    </div>
                  </div>

                  <button className="mt-6 w-full rounded-lg border border-[#18392b] px-4 py-2.5 text-sm font-semibold text-[#18392b] transition hover:bg-[#18392b] hover:text-white">
                    View Profile
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-[#cfc8b8] bg-white px-6 py-16 text-center">
              <Search size={34} className="mx-auto text-gray-400" />

              <h3 className="mt-4 font-serif text-2xl font-bold text-[#18392b]">
                No alumni found
              </h3>

              <p className="mt-2 text-gray-500">
                Try another name, profession, company, or batch.
              </p>
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  );
}
