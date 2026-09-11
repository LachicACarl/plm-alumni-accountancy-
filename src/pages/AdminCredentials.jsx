import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileCheck2,
  GraduationCap,
  Search,
  XCircle,
} from "lucide-react";

const credentialData = [
  {
    id: 1,
    alumni: "Maria Santos",
    studentNumber: "2021-00125",
    type: "CPA Certificate",
    submitted: "May 20, 2026",
    status: "Pending",
  },
  {
    id: 2,
    alumni: "John Reyes",
    studentNumber: "2020-00418",
    type: "Certificate of Graduation",
    submitted: "May 18, 2026",
    status: "Verified",
  },
  {
    id: 3,
    alumni: "Angela Cruz",
    studentNumber: "2019-00831",
    type: "Academic Transcript",
    submitted: "May 17, 2026",
    status: "Pending",
  },
  {
    id: 4,
    alumni: "Carlos Mendoza",
    studentNumber: "2018-00642",
    type: "CPA Certificate",
    submitted: "May 15, 2026",
    status: "Rejected",
  },
  {
    id: 5,
    alumni: "Sofia Garcia",
    studentNumber: "2017-00317",
    type: "Certificate of Graduation",
    submitted: "May 12, 2026",
    status: "Verified",
  },
  {
    id: 6,
    alumni: "Daniel Flores",
    studentNumber: "2016-00924",
    type: "Academic Transcript",
    submitted: "May 10, 2026",
    status: "Pending",
  },
];

export default function AdminCredentials() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [credentials, setCredentials] = useState(credentialData);

  const filteredCredentials = useMemo(() => {
    return credentials.filter((credential) => {
      const value = search.toLowerCase();

      const matchesSearch =
        credential.alumni.toLowerCase().includes(value) ||
        credential.studentNumber.toLowerCase().includes(value) ||
        credential.type.toLowerCase().includes(value);

      const matchesFilter =
        filter === "All" || credential.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [credentials, search, filter]);

  const updateStatus = (id, status) => {
    setCredentials((current) =>
      current.map((credential) =>
        credential.id === id
          ? { ...credential, status }
          : credential
      )
    );
  };

  const pendingCount = credentials.filter(
    (credential) => credential.status === "Pending"
  ).length;

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

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-white/50">Administrator</p>
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

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7b16]">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold md:text-4xl">
                Credential Verification
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review documents submitted by alumni and verify their
                credentials.
              </p>
            </div>

            <div className="rounded-xl border border-[#d8d2c2] bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pending Review
              </p>
              <p className="mt-1 text-2xl font-bold text-[#9a7b16]">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search alumni, student number, or credential..."
                className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm outline-none focus:border-[#18392b]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#e4dfd3] px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392b]/10 text-[#18392b]">
              <FileCheck2 size={20} />
            </div>

            <div>
              <h2 className="font-bold">Submitted Credentials</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredCredentials.length} of{" "}
                {credentials.length} records
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#f7f5ee]">
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4 font-semibold">Alumni</th>
                  <th className="px-5 py-4 font-semibold">Credential</th>
                  <th className="px-5 py-4 font-semibold">Submitted</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee9df]">
                {filteredCredentials.map((credential) => (
                  <tr
                    key={credential.id}
                    className="transition hover:bg-[#fbfaf6]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold">
                        {credential.alumni}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {credential.studentNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold">
                        {credential.type}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Document submission
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {credential.submitted}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          credential.status === "Verified"
                            ? "bg-emerald-100 text-emerald-700"
                            : credential.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {credential.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg border border-[#d8d2c2] px-3 py-2 text-xs font-bold text-[#18392b] transition hover:border-[#18392b] hover:bg-[#f7f5ee]"
                        >
                          <Eye size={15} />
                          View
                        </button>

                        {credential.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(credential.id, "Verified")
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                            >
                              <CheckCircle2 size={15} />
                              Verify
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(credential.id, "Rejected")
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                            >
                              <XCircle size={15} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCredentials.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No credential records match your search or filter.
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
