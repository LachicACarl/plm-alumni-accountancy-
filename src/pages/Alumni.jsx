import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserRound,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Users,
  RotateCcw,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import { supabase } from "../lib/supabase";
import plmCampus from "../assets/plm-campus.jpg";

const safeImage = (value) =>
  typeof value === "string" && /^https:\/\//i.test(value) ? value : "";

const fullName = (person) =>
  [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(" ");

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAlumni() {
      setLoading(true);
      setError("");
      const { data, error: requestError } = await supabase.rpc("get_public_alumni");

      if (!active) return;
      if (requestError) {
        setError("The alumni directory is temporarily unavailable. Please try again later.");
        setAlumni([]);
      } else {
        setAlumni(data ?? []);
      }
      setLoading(false);
    }

    loadAlumni();
    return () => {
      active = false;
    };
  }, []);

  const years = useMemo(
    () =>
      [...new Set(alumni.map((person) => person.graduation_year).filter(Boolean))]
        .sort((a, b) => b - a)
        .map(String),
    [alumni]
  );

  const filteredAlumni = useMemo(() => {
    const query = search.trim().toLowerCase();
    return alumni.filter((person) => {
      const searchable = [
        fullName(person),
        person.profession,
        person.company,
        person.graduation_year,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (batch === "All" || String(person.graduation_year) === batch)
      );
    });
  }, [alumni, search, batch]);

  function clearFilters() {
    setSearch("");
    setBatch("All");
  }

  return (
    <PublicLayout>
      <main className="bg-[#f7f5ee] text-[#18392b]">
        <section className="relative isolate overflow-hidden bg-[#18392b] text-white">
          <img
            src={plmCampus}
            alt="Pamantasan ng Lungsod ng Maynila campus"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102b1f]/95 via-[#18392b]/90 to-[#18392b]/65" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e3c55e]">
              The BSA Community
            </p>
            <h1 className="mt-3 font-serif text-5xl font-bold md:text-6xl">
              Meet Our Alumni
            </h1>
            <div className="mt-5 h-1 w-20 bg-[#d4af37]" />
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80">
              Discover the active alumni community and reconnect with graduates
              across different batches and professions.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="rounded-3xl border border-[#ddd7c8] bg-white p-5 shadow-sm md:p-7">
            <div className="grid gap-4 md:grid-cols-[1fr_230px]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Search alumni</span>
                <span className="relative block">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, profession, or organization..."
                    className="w-full rounded-xl border border-[#d8d4c8] bg-[#faf9f5] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#315f45] focus:ring-2 focus:ring-[#315f45]/10"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Filter by batch</span>
                <select
                  value={batch}
                  onChange={(event) => setBatch(event.target.value)}
                  className="w-full rounded-xl border border-[#d8d4c8] bg-[#faf9f5] px-4 py-3.5 text-sm outline-none focus:border-[#315f45]"
                >
                  <option value="All">All batches</option>
                  {years.map((year) => <option key={year} value={year}>BSA Batch {year}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee9dc] pt-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee9dc]"><Users size={18}/></span>
                <div>
                  <p className="text-sm font-semibold">Public alumni directory</p>
                  <p className="text-xs text-gray-500">{loading ? "Loading records..." : `${filteredAlumni.length} active alumni found`}</p>
                </div>
              </div>
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 rounded-lg border border-[#ded8c9] px-3 py-2 text-xs font-bold text-[#315f45] hover:bg-[#f7f5ee]">
                <RotateCcw size={14}/> Clear filters
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">PLM College of Accountancy</p>
              <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Alumni Directory</h2>
            </div>
            <p className="text-sm text-gray-500">{loading ? "—" : filteredAlumni.length + " results"}</p>
          </div>

          {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl border border-[#e5dfd0] bg-white"/> )}
            </div>
          ) : !error && filteredAlumni.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAlumni.map((person) => {
                const name = fullName(person) || "PLM BSA Alumni";
                const image = safeImage(person.profile_image_url);
                return (
                  <article key={person.id} className="overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-2 bg-gradient-to-r from-[#d4af37] to-[#18392b]"/>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#eee9dc] bg-[#18392b] text-white">
                          {image ? <img src={image} alt={name} className="h-full w-full object-cover"/> : <UserRound size={34}/>}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif text-xl font-bold">{name}</h3>
                          <span className="mt-1 inline-block rounded-full bg-[#eee9dc] px-3 py-1 text-xs font-bold text-[#8d6d12]">
                            {person.graduation_year ? `BSA Batch ${person.graduation_year}` : "PLM BSA Alumni"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4 border-t border-[#eee9dc] pt-5">
                        <div className="flex gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e6] text-[#b28b1e]"><GraduationCap size={17}/></span>
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Profession</p><p className="mt-1 text-sm font-medium">{person.profession || "Not provided"}</p></div>
                        </div>
                        <div className="flex gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f0e6] text-[#b28b1e]"><BriefcaseBusiness size={17}/></span>
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Organization</p><p className="mt-1 text-sm font-medium">{person.company || "Not provided"}</p></div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !error ? (
            <div className="rounded-3xl border border-dashed border-[#cfc8b8] bg-white px-6 py-16 text-center">
              <Users size={30} className="mx-auto text-[#315f45]"/>
              <h3 className="mt-4 font-serif text-2xl font-bold">No active alumni found</h3>
              <p className="mt-2 text-sm text-gray-500">Try another search or check back as more alumni complete their profiles.</p>
              <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white">Clear filters</button>
            </div>
          ) : null}
        </section>
      </main>
    </PublicLayout>
  );
}
