import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  Plus,
  Search,
  Users,
  UserCheck,
  UserX,
  Filter,
  ChevronRight,
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

const batches = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019"];

export default function AdminAlumni() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredAlumni = useMemo(() => {
    return alumniData.filter((alumni) => {
      const searchValue = search.toLowerCase().trim();

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

  const activeCount = alumniData.filter(
    (alumni) => alumni.status === "Active"
  ).length;

  const inactiveCount = alumniData.filter(
    (alumni) => alumni.status === "Inactive"
  ).length;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#315442] bg-[#18392b] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                PLM College of Accountancy
              </p>

              <p className="font-serif text-base font-bold">
                BSA Alumni Administration
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-white/50">System Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Users size={19} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Back */}
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#18392b] transition hover:text-[#b28b1e]"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28b1e]">
              Administration
            </p>

            <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
              Alumni Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Search, review, and manage registered BSA alumni records.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#24513d]"
          >
            <Plus size={18} />
            Add Alumni
          </button>
        </div>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                <Users size={20} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Total Records
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {alumniData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5ef] text-[#286044]">
                <UserCheck size={20} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Active Alumni
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2eee5] text-gray-500">
                <UserX size={20} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Inactive Alumni
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {inactiveCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mt-7 rounded-3xl border border-[#ddd7c8] bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
              <Filter size={18} />
            </div>

            <div>
              <h2 className="font-serif text-lg font-bold">
                Search & Filter
              </h2>

              <p className="text-xs text-gray-400">
                Narrow the alumni records displayed below.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_190px_190px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, student number, profession, or company..."
                className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm text-[#18392b] outline-none transition placeholder:text-gray-400 focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
              />
            </div>

            <select
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
            >
              {batches.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Batches" : `Batch ${year}`}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Alumni Table */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#e4dfd3] px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b28b1e]">
                Directory
              </p>

              <h2 className="mt-1 font-serif text-xl font-bold">
                Registered Alumni
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredAlumni.length} of {alumniData.length} records
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
              <Users size={19} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#f7f5ee]">
                <tr className="border-b border-[#e4dfd3] text-[11px] uppercase tracking-[0.12em] text-gray-500">
                  <th className="px-5 py-4 font-bold lg:px-6">Alumni</th>
                  <th className="px-5 py-4 font-bold">Student No.</th>
                  <th className="px-5 py-4 font-bold">Batch</th>
                  <th className="px-5 py-4 font-bold">Profession</th>
                  <th className="px-5 py-4 font-bold">Company</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee9df]">
                {filteredAlumni.map((alumni) => (
                  <tr
                    key={alumni.id}
                    className="group transition hover:bg-[#fbfaf6]"
                  >
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#18392b] font-serif text-sm font-bold text-[#d4af37]">
                          {getInitials(alumni.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#18392b]">
                            {alumni.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Alumni Member
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {alumni.studentNumber}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#fff7df] px-3 py-1 text-xs font-bold text-[#806612]">
                        BSA {alumni.batch}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {alumni.profession}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {alumni.company}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          alumni.status === "Active"
                            ? "bg-[#eef5ef] text-[#286044]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {alumni.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#d8d2c2] px-3 py-2 text-xs font-bold text-[#18392b] transition hover:border-[#18392b] hover:bg-[#f7f5ee]"
                      >
                        <Eye size={15} />
                        View
                        <ChevronRight
                          size={13}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAlumni.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                        <Users size={24} />
                      </div>

                      <h3 className="mt-4 font-serif text-lg font-bold">
                        No alumni records found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search terms or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#ddd7c8] py-6">
          <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 PLM College of Accountancy — BSA Alumni System
            </p>

            <Link
              to="/admin"
              className="font-semibold text-[#18392b] hover:text-[#b28b1e]"
            >
              Admin Dashboard
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
