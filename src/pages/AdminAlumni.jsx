import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  Plus,
  Search,
  Users,
} from "lucide-react";

const alumniData = [
  {
    id: 1,
    name: "Maria Santos",
    studentNumber: "2021-00125",
    batch: "2025",
    profession: "Certified Public Accountant",
    company: "Santos & Associates",
    status: "Active",
  },
  {
    id: 2,
    name: "John Reyes",
    studentNumber: "2020-00418",
    batch: "2024",
    profession: "Accountant",
    company: "Reyes Accounting Services",
    status: "Active",
  },
  {
    id: 3,
    name: "Angela Cruz",
    studentNumber: "2019-00831",
    batch: "2023",
    profession: "Financial Analyst",
    company: "Metro Finance Corp.",
    status: "Active",
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    studentNumber: "2018-00642",
    batch: "2022",
    profession: "Auditor",
    company: "Mendoza & Co.",
    status: "Active",
  },
  {
    id: 5,
    name: "Sofia Garcia",
    studentNumber: "2017-00317",
    batch: "2021",
    profession: "Tax Consultant",
    company: "Garcia Tax Solutions",
    status: "Active",
  },
  {
    id: 6,
    name: "Daniel Flores",
    studentNumber: "2016-00924",
    batch: "2020",
    profession: "Accounting Manager",
    company: "Global Business Inc.",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Patricia Aquino",
    studentNumber: "2015-00276",
    batch: "2019",
    profession: "CPA",
    company: "Aquino Financial Services",
    status: "Active",
  },
];

export default function AdminAlumni() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredAlumni = useMemo(() => {
    return alumniData.filter((alumni) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        alumni.name.toLowerCase().includes(searchValue) ||
        alumni.studentNumber.toLowerCase().includes(searchValue) ||
        alumni.profession.toLowerCase().includes(searchValue) ||
        alumni.company.toLowerCase().includes(searchValue);

      const matchesBatch = batch === "All" || alumni.batch === batch;
      const matchesStatus = status === "All" || alumni.status === status;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [search, batch, status]);

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="border-b border-[#d8d2c2] bg-[#18392b] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#d4af37]">
                PLM ACCOUNTANCY
              </p>
              <p className="text-sm font-bold">BSA Alumni Admin</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Users size={19} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#18392b] hover:text-[#9a7b16]"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7b16]">
              Administration
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Alumni Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Search, review, and manage registered BSA alumni records.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24513d]"
          >
            <Plus size={18} />
            Add Alumni
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, student number, profession, or company..."
                className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
              />
            </div>

            <select
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm outline-none focus:border-[#18392b]"
            >
              <option value="All">All Batches</option>
              <option value="2025">Batch 2025</option>
              <option value="2024">Batch 2024</option>
              <option value="2023">Batch 2023</option>
              <option value="2022">Batch 2022</option>
              <option value="2021">Batch 2021</option>
              <option value="2020">Batch 2020</option>
              <option value="2019">Batch 2019</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm outline-none focus:border-[#18392b]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e4dfd3] px-5 py-4">
            <div>
              <h2 className="font-bold">Registered Alumni</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredAlumni.length} of {alumniData.length} records
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392b]/10 text-[#18392b]">
              <Users size={19} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#f7f5ee]">
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4 font-semibold">Alumni</th>
                  <th className="px-5 py-4 font-semibold">Student No.</th>
                  <th className="px-5 py-4 font-semibold">Batch</th>
                  <th className="px-5 py-4 font-semibold">Profession</th>
                  <th className="px-5 py-4 font-semibold">Company</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee9df]">
                {filteredAlumni.map((alumni) => (
                  <tr key={alumni.id} className="transition hover:bg-[#fbfaf6]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18392b] text-sm font-bold text-[#d4af37]">
                          {alumni.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                          <p className="text-sm font-bold">{alumni.name}</p>
                          <p className="text-xs text-slate-400">
                            Alumni Member
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {alumni.studentNumber}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-bold text-[#806612]">
                        {alumni.batch}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {alumni.profession}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {alumni.company}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          alumni.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {alumni.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d8d2c2] px-3 py-2 text-xs font-bold text-[#18392b] transition hover:border-[#18392b] hover:bg-[#f7f5ee]"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAlumni.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No alumni records match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
