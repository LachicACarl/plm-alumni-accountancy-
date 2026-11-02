import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Users,
  Award,
  BriefcaseBusiness,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { supabase } from "../lib/supabase";
import { fetchAllPublicAlumni } from "../lib/publicAlumni";
import plmCampus from "../assets/plm-campus.jpg";

const imageUrl = (value) =>
  typeof value === "string" && /^https:\/\//i.test(value) ? value : "";

const displayName = (person) =>
  [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(" ");

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");
  const [rosterSearch, setRosterSearch] = useState("");
  const [rosterBlock, setRosterBlock] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPage() {
      setLoading(true);
      setError("");
      try {
        const [batchResult, alumniRecords] = await Promise.all([
          supabase.from("batches").select("id, year, description, highlights, image_url").order("year", { ascending: false }),
          fetchAllPublicAlumni({ client: supabase }),
        ]);

        if (!active) return;
        if (batchResult.error) throw batchResult.error;

        const records = batchResult.data ?? [];
        setBatches(records);
        setAlumni(alumniRecords);
        if (records.length) setSelectedYear(String(records[0].year));
      } catch (loadError) {
        if (!active) return;
        console.error("Unable to load batch information:", loadError);
        setError("Batch information is temporarily unavailable. Please try again later.");
        setBatches([]);
        setAlumni([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();
    return () => {
      active = false;
    };
  }, []);

  const selectedBatch = useMemo(
    () => batches.find((item) => String(item.year) === selectedYear) ?? batches[0] ?? null,
    [batches, selectedYear]
  );

  const members = useMemo(
    () => alumni.filter((person) => String(person.graduation_year) === String(selectedBatch?.year)),
    [alumni, selectedBatch]
  );

  const highlights = Array.isArray(selectedBatch?.highlights)
    ? selectedBatch.highlights.filter((item) => typeof item === "string" && item.trim())
    : [];

  useEffect(() => {
    let active = true;
    async function loadRoster() {
      if (!selectedBatch?.id) {
        setRoster([]);
        setRosterError("");
        return;
      }
      setRosterLoading(true);
      setRosterError("");
      const { data, error: rosterQueryError } = await supabase
        .from("batch_students")
        .select("id, batch_id, full_name, block_label, cpa_passed")
        .eq("batch_id", selectedBatch.id)
        .order("block_label", { ascending: true })
        .order("full_name", { ascending: true });
      if (!active) return;
      if (rosterQueryError) {
        console.error("Unable to load public batch roster:", rosterQueryError);
        setRoster([]);
        setRosterError("The student roster is currently unavailable. Please check the public read permissions for batch_students.");
      } else {
        setRoster(data ?? []);
      }
      setRosterLoading(false);
    }
    loadRoster();
    return () => { active = false; };
  }, [selectedBatch?.id]);

  const rosterBlocks = useMemo(() => {
    const blocks = ["BSA 4-1", "BSA 4-2", "BSA 4-3"];
    return blocks.map((block) => {
      const students = roster.filter((student) => student.block_label === block);
      return { block, students, count: students.length, passers: students.filter((student) => Boolean(student.cpa_passed)).length };
    });
  }, [roster]);

  const filteredRoster = useMemo(() => {
    const query = rosterSearch.trim().toLowerCase();
    return roster.filter((student) => {
      const matchesBlock = rosterBlock === "all" || student.block_label === rosterBlock;
      const matchesName = !query || (student.full_name ?? "").toLowerCase().includes(query);
      return matchesBlock && matchesName;
    });
  }, [roster, rosterSearch, rosterBlock]);

  return (
    <PublicLayout>
      <main className="bg-[#fbfaf5] text-[#18392b]">
        <section className="relative isolate h-[245px] overflow-hidden sm:h-[270px]">
          <img src={plmCampus} alt="Pamantasan ng Lungsod ng Maynila campus" className="absolute inset-0 h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#102b1f]/95 via-[#18392b]/82 to-[#18392b]/45"/>
          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e3c55e]">PLM BSA Alumni</p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-none text-white sm:text-6xl md:text-7xl">Explore Our Batches</h1>
              <p className="mt-5 font-serif text-base leading-7 text-white/80 sm:text-lg">Discover the generations of PLM Bachelor of Science in Accountancy graduates.</p>
              <div className="mx-auto mt-6 h-[3px] w-20 rounded-full bg-[#d4af37]"/>
            </div>
          </div>
        </section>

        <section className="border-y border-[#ded8c9] bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto px-6 md:px-10">
            <div className="flex min-w-max items-center gap-2 py-4">
              <div className="mr-3 hidden items-center gap-2 border-r border-[#ded8c9] pr-5 sm:flex">
                <CalendarDays size={17} className="text-[#b28b1e]"/>
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#68736c]">Batch Year</span>
              </div>
              {batches.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelectedYear(String(item.year))} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${String(item.year) === String(selectedBatch?.year) ? "bg-[#18392b] text-white shadow-md" : "text-[#657069] hover:bg-[#eef2e9] hover:text-[#28583e]"}`}>
                  {item.year}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf5] px-6 py-12 md:px-10 lg:px-12">
          {error && <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {loading ? (
            <div className="h-[420px] animate-pulse rounded-3xl bg-white"/>
          ) : selectedBatch ? (
            <>
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b28b1e]">Explore a Generation</p>
                <h2 className="mt-2 font-serif text-4xl font-bold md:text-5xl">BSA Batch {selectedBatch.year}</h2>
                <div className="mt-4 flex items-center gap-2"><div className="h-[3px] w-14 rounded-full bg-[#d4af37]"/><div className="h-[3px] w-8 rounded-full bg-[#719878]/60"/></div>
              </div>

              <div className="grid overflow-hidden rounded-[24px] border border-[#ded8c9] bg-white shadow-[0_12px_38px_rgba(24,57,43,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[350px] overflow-hidden bg-[#18392b] lg:min-h-[500px]">
                  <img src={imageUrl(selectedBatch.image_url) || plmCampus} alt={`BSA Batch ${selectedBatch.year}`} className="absolute inset-0 h-full w-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102b1f]/90 via-[#18392b]/20 to-transparent"/>
                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e3c55e]">PLM College of Accountancy</p>
                    <p className="mt-2 font-serif text-3xl font-bold text-white">{selectedBatch.year}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0e5] text-[#315f45]"><GraduationCap size={29}/></div>
                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">About This Batch</p>
                  <h3 className="mt-2 font-serif text-3xl font-bold md:text-4xl">A legacy worth celebrating</h3>
                  <p className="mt-5 text-sm leading-7 text-[#68736c]">{selectedBatch.description || "Celebrating the graduates and alumni of this PLM BSA batch."}</p>
                  <div className="mt-7 flex items-center gap-4 rounded-2xl border border-[#e5dfd0] bg-[#fbfaf5] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18392b] text-white"><Users size={21}/></div>
                    <div><p className="font-serif text-2xl font-bold">{members.length}</p><p className="text-xs font-medium text-[#758078]">Active public alumni</p></div>
                    <div className="ml-auto hidden h-10 w-px bg-[#ded8c9] sm:block"/>
                    <div className="hidden sm:block"><p className="text-xs font-bold uppercase tracking-wide text-[#b28b1e]">Batch</p><p className="mt-1 text-sm font-semibold">{selectedBatch.year}</p></div>
                  </div>
                  <Link to="/alumni" className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b84c] to-[#65966d] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5">Meet the Alumni <ArrowRight size={15}/></Link>
                </div>
              </div>

              <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">Batch Highlights</p>
                  <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Celebrating their journey</h2>
                  <p className="mt-4 text-sm leading-7 text-[#68736c]">Every batch carries a unique story shaped by friendships, achievements, professional growth, and the values learned at PLM.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.length ? highlights.map((highlight, index) => (
                    <div key={highlight} className="rounded-2xl border border-[#ded8c9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4ce] text-[#b28b1e]">{index === 0 ? <Award size={21}/> : index === 1 ? <BriefcaseBusiness size={21}/> : <Users size={21}/>}</div>
                      <p className="mt-5 text-sm font-bold leading-6">{highlight}</p>
                    </div>
                  )) : <p className="text-sm text-[#68736c]">Batch highlights will be added soon.</p>}
                </div>
              </div>

              <section className="mt-16 border-t border-[#e3ddcf] pt-14" aria-labelledby="batch-roster-heading">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">Official Class Roster</p>
                    <h2 id="batch-roster-heading" className="mt-2 font-serif text-3xl font-bold md:text-4xl">Meet the Batch</h2>
                    <p className="mt-3 text-sm leading-6 text-[#68736c]">Student roster grouped by block for BSA Batch {selectedBatch.year}.</p>
                  </div>
                  <span className="rounded-full border border-[#ded8c9] bg-white px-4 py-2 text-sm font-bold text-[#315f45]">{roster.length} students</span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {rosterBlocks.map((group) => (
                    <article key={group.block} className="rounded-2xl border border-[#ded8c9] bg-white p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#b28b1e]">{group.block}</p>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <div><p className="font-serif text-3xl font-bold">{group.count}</p><p className="text-xs text-[#68736c]">Students</p></div>
                        <div className="text-right"><p className="font-serif text-xl font-bold text-[#315f45]">{group.passers}</p><p className="text-xs text-[#68736c]">CPA passers</p></div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <label className="relative flex-1">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#879188]" />
                    <input value={rosterSearch} onChange={(event) => setRosterSearch(event.target.value)} className="w-full rounded-xl border border-[#d8ddd6] bg-white py-3 pl-10 pr-4 text-sm" placeholder="Search student name" aria-label="Search student name" />
                  </label>
                  <select value={rosterBlock} onChange={(event) => setRosterBlock(event.target.value)} className="rounded-xl border border-[#d8ddd6] bg-white px-4 py-3 text-sm" aria-label="Filter roster by block">
                    <option value="all">All blocks</option><option value="BSA 4-1">BSA 4-1</option><option value="BSA 4-2">BSA 4-2</option><option value="BSA 4-3">BSA 4-3</option>
                  </select>
                </div>
                {rosterLoading ? (
                  <p className="mt-5 rounded-xl border border-[#ded8c9] bg-white p-8 text-center text-sm text-[#68736c]">Loading batch roster…</p>
                ) : rosterError ? (
                  <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{rosterError}</p>
                ) : filteredRoster.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRoster.map((student) => (
                      <article key={student.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#ded8c9] bg-white px-5 py-4">
                        <div className="min-w-0"><h3 className="truncate font-semibold text-[#18392b]">{student.full_name}</h3><p className="mt-1 text-xs text-[#68736c]">{student.block_label}</p></div>
                        {student.cpa_passed ? <span className="shrink-0 rounded-full bg-[#e8f0e5] px-3 py-1 text-[11px] font-bold text-[#315f45]">CPA Passer</span> : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-dashed border-[#ded8c9] bg-white p-8 text-center text-sm text-[#68736c]">{roster.length ? "No students match your search or block filter." : "No student roster entries are available for this batch yet."}</p>
                )}
              </section>

              <div className="mt-16 border-t border-[#e3ddcf] pt-14">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b28b1e]">Batch Members</p>
                    <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Meet the Alumni</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68736c]">Active graduates from this batch.</p>
                  </div>
                  <Link to="/alumni" className="inline-flex items-center gap-2 text-sm font-bold text-[#315f45] hover:text-[#b28b1e]">View Alumni Directory <ArrowRight size={16}/></Link>
                </div>
                {members.length ? (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {members.slice(0, 8).map((person) => {
                      const name = displayName(person) || "PLM BSA Alumni";
                      const image = imageUrl(person.profile_image_url);
                      return <article key={person.id} className="rounded-[20px] border border-[#ded8c9] bg-white p-6 text-center shadow-sm">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#f1ead9] bg-[#18392b] text-white">{image ? <img src={image} alt={name} className="h-full w-full object-cover"/> : <Users size={32}/>}</div>
                        <h3 className="mt-5 font-serif text-lg font-bold">{name}</h3>
                        <p className="mt-1 text-xs leading-5 text-[#78817b]">{person.profession || "PLM BSA Alumni"}</p>
                      </article>;
                    })}
                  </div>
                ) : <p className="mt-8 rounded-2xl border border-dashed border-[#ded8c9] bg-white p-8 text-center text-sm text-[#68736c]">No active alumni profiles are listed for this batch yet.</p>}
              </div>
            </>
          ) : !error ? (
            <div className="rounded-3xl border border-dashed border-[#ded8c9] bg-white px-6 py-16 text-center">
              <GraduationCap size={32} className="mx-auto text-[#315f45]"/>
              <h2 className="mt-4 font-serif text-2xl font-bold">No batches published yet</h2>
              <p className="mt-2 text-sm text-gray-500">The administration team can add batches from the Admin Dashboard.</p>
            </div>
          ) : null}
        </section>
      </main>
    </PublicLayout>
  );
}
