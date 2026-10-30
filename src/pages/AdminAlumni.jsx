import { useEffect, useMemo, useState } from "react";
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
import { supabase } from "../lib/supabase";

export default function AdminAlumni() {
  const [alumniData, setAlumniData] = useState([]);
  const [batchOptions, setBatchOptions] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    async function loadAlumni() {
      setLoading(true);
      setError("");

      const { data, error: alumniError } = await supabase
        .from("profiles")
        .select(
          "id, student_number, first_name, middle_name, last_name, email, graduation_year, profession, company, role, account_status, created_at"
        )
        .eq("role", "alumni")
        .order("last_name", { ascending: true });

      if (alumniError) {
        setError(alumniError.message);
        setAlumniData([]);
        setLoading(false);
        return;
      }

      const formatted = (data ?? []).map((alumni) => ({
        id: alumni.id,
        name: [alumni.first_name, alumni.middle_name, alumni.last_name]
          .filter(Boolean)
          .join(" "),
        studentNumber: alumni.student_number || "—",
        batch: alumni.graduation_year
          ? String(alumni.graduation_year)
          : "—",
        profession: alumni.profession || "Not specified",
        company: alumni.company || "Not specified",
        email: alumni.email || "",
        status: alumni.account_status === "inactive" ? "Inactive" : "Active",
      }));

      const years = [
        ...new Set(
          formatted
            .map((alumni) => alumni.batch)
            .filter((year) => year !== "—")
        ),
      ].sort((a, b) => Number(b) - Number(a));

      setAlumniData(formatted);
      setBatchOptions(["All", ...years]);
      setLoading(false);
    }

    loadAlumni();
  }, []);

  const filteredAlumni = useMemo(() => {
    return alumniData.filter((alumni) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        alumni.name.toLowerCase().includes(searchValue) ||
        alumni.studentNumber.toLowerCase().includes(searchValue) ||
        alumni.profession.toLowerCase().includes(searchValue) ||
        alumni.company.toLowerCase().includes(searchValue) ||
        alumni.email.toLowerCase().includes(searchValue);

      const matchesBatch =
        batch === "All" || alumni.batch === batch;

      const matchesStatus =
        status === "All" || alumni.status === status;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [alumniData, search, batch, status]);

  const activeCount = alumniData.filter(
    (alumni) => alumni.status === "Active"
  ).length;

  const inactiveCount = alumniData.filter(
    (alumni) => alumni.status === "Inactive"
  ).length;

  async function handleStatusToggle(alumni) {
    if (updatingStatusId) return;

    const nextStatus =
      alumni.status === "Active" ? "inactive" : "active";

    setUpdatingStatusId(alumni.id);
    setError("");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ account_status: nextStatus })
      .eq("id", alumni.id)
      .eq("role", "alumni");

    if (updateError) {
      setError(`Unable to update ${alumni.name}'s status: ${updateError.message}`);
      setUpdatingStatusId(null);
      return;
    }

    const displayStatus = nextStatus === "active" ? "Active" : "Inactive";
    setAlumniData((current) =>
      current.map((record) =>
        record.id === alumni.id
          ? { ...record, status: displayStatus }
          : record
      )
    );
    setSelectedAlumni((current) =>
      current?.id === alumni.id
        ? { ...current, status: displayStatus }
        : current
    );
    setUpdatingStatusId(null);
  }

  const getInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
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
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#18392b] transition hover:text-[#b28b1e]"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

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
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#24513d]"
          >
            <Plus size={18} />
            Add Alumni
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            Unable to load alumni records: {error}
          </div>
        )}

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
                  {loading ? "—" : alumniData.length}
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
                  {loading ? "—" : activeCount}
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
                  {loading ? "—" : inactiveCount}
                </p>
              </div>
            </div>
          </div>
        </section>

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
                placeholder="Search name, student number, profession, company, or email..."
                className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm text-[#18392b] outline-none transition placeholder:text-gray-400 focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
              />
            </div>

            <select
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
            >
              {batchOptions.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Batches" : "Batch " + year}
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
                Showing {loading ? "—" : filteredAlumni.length} of{" "}
                {loading ? "—" : alumniData.length} records
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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-[#18392b]" />
                      <p className="mt-4 text-sm font-semibold text-gray-500">
                        Loading alumni records...
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAlumni.map((alumni) => (
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
                              {alumni.email || "Alumni Member"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {alumni.studentNumber}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#fff7df] px-3 py-1 text-xs font-bold text-[#806612]">
                          {alumni.batch === "—"
                            ? "Batch not set"
                            : "BSA " + alumni.batch}
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
                          className={
                            "inline-flex rounded-full px-3 py-1 text-xs font-bold " +
                            (alumni.status === "Active"
                              ? "bg-[#eef5ef] text-[#286044]"
                              : "bg-gray-100 text-gray-500")
                          }
                        >
                          {alumni.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAlumni(alumni)}
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
                  ))
                )}

                {!loading && filteredAlumni.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center">
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

        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#18392b]/60 px-4 py-6 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#ddd7c8] bg-[#f7f5ee] shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="bg-[#18392b] px-6 py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                      Alumni Management
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold">
                      Add Alumni
                    </h2>

                    <p className="mt-1 text-sm text-white/60">
                      Create a new alumni profile record.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <form
                className="space-y-5 p-6"
                onSubmit={async (event) => {
                  event.preventDefault();

                  const form = event.currentTarget;
                  const formData = new FormData(form);

                  const payload = {
                    email: String(formData.get("email") || "").trim(),
                    password: String(formData.get("password") || ""),
                    first_name: String(formData.get("first_name") || "").trim(),
                    middle_name: "",
                    last_name: String(formData.get("last_name") || "").trim(),
                    student_number: String(formData.get("student_number") || "").trim(),
                    graduation_year: Number(formData.get("graduation_year") || 0),
                    profession: String(formData.get("profession") || "").trim(),
                    company: String(formData.get("company") || "").trim(),
                  };

                  try {
                    const { data, error } = await supabase.functions.invoke(
                      "create-alumni",
                      { body: payload }
                    );

                    if (error) {
                      let message = error.message || "Unable to create alumni account.";

                      try {
                        if (error.context) {
                          const responseBody = await error.context.json();
                          message = responseBody?.error || message;
                        }
                      } catch {
                        // Keep the original error message if the response body cannot be parsed.
                      }

                      throw new Error(message);
                    }

                    if (!data?.success) {
                      throw new Error(
                        data?.error || "Unable to create alumni account."
                      );
                    }

                    alert("Alumni account created successfully.");
                    form.reset();
                    setShowAddModal(false);
                    window.location.reload();
                  } catch (error) {
                    console.error("Create alumni error:", error);
                    alert(
                      error.message || "Unable to create alumni account."
                    );
                  }
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First name"
                      required
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last name"
                      required
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Student Number
                    </label>
                    <input
                      type="text"
                      name="student_number"
                      placeholder="e.g. 2026-00123"
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      name="graduation_year"
                      placeholder="e.g. 2026"
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="alumni@example.com"
                      required
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Temporary Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="e.g. Certified Public Accountant"
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company or organization"
                      className="w-full rounded-xl border border-[#d8d2c2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d8d2c2] bg-[#fbfaf6] p-4">
                  <p className="text-xs font-bold text-[#18392b]">
                    Account creation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    This action creates an alumni sign-in account in Supabase Authentication and saves the matching alumni profile. Share the temporary password securely and ask the alumnus to change it after signing in.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#ddd7c8] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-[#d8d2c2] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:bg-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24513d]"
                  >
                    <Plus size={17} />
                    Save Alumni
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {selectedAlumni && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#18392b]/60 px-4 py-6 backdrop-blur-sm"
            onClick={() => setSelectedAlumni(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#ddd7c8] bg-[#f7f5ee] shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="bg-[#18392b] px-6 py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37] font-serif text-lg font-bold text-[#18392b]">
                      {getInitials(selectedAlumni.name)}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                        Alumni Profile
                      </p>

                      <h2 className="mt-1 font-serif text-2xl font-bold">
                        {selectedAlumni.name}
                      </h2>

                      <p className="mt-1 text-sm text-white/60">
                        {selectedAlumni.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAlumni(null)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Student Number
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#18392b]">
                    {selectedAlumni.studentNumber}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Alumni Batch
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#18392b]">
                    {selectedAlumni.batch === "â€”"
                      ? "Batch not set"
                      : "BSA " + selectedAlumni.batch}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Profession
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#18392b]">
                    {selectedAlumni.profession}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Company
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#18392b]">
                    {selectedAlumni.company}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Account Status
                  </p>

                  <div className="mt-2">
                    <span
                      className={
                        "inline-flex rounded-full px-3 py-1 text-xs font-bold " +
                        (selectedAlumni.status === "Active"
                          ? "bg-[#eef5ef] text-[#286044]"
                          : "bg-gray-100 text-gray-500")
                      }
                    >
                      {selectedAlumni.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#ddd7c8] px-6 py-5">
                <p className="text-xs leading-5 text-gray-500">
                  This information is loaded from the alumni profile stored in
                  the PLM Alumni System database.
                </p>
                <button
                  type="button"
                  onClick={() => handleStatusToggle(selectedAlumni)}
                  disabled={updatingStatusId === selectedAlumni.id}
                  className="mt-4 rounded-xl border border-[#d8d2c2] px-4 py-2.5 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingStatusId === selectedAlumni.id
                    ? "Updating..."
                    : selectedAlumni.status === "Active"
                      ? "Mark as Inactive"
                      : "Mark as Active"}
                </button>
              </div>
            </div>
          </div>
        )}
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
