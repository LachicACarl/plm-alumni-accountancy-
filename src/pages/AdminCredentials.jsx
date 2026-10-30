import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileCheck2,
  GraduationCap,
  Search,
  XCircle,
  Clock3,
  ShieldCheck,
  FileText,
  Filter,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const BUCKET = "alumni-credentials";
const CREDENTIAL_PAGE_SIZE = 1000;

function formatStatus(status) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminCredentials() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  async function loadCredentials() {
    setLoading(true);
    setError("");

    try {
      const records = [];
      let rangeStart = 0;

      while (true) {
        const { data, error: credentialsError } = await supabase
          .from("credentials")
          .select(
            "id, profile_id, credential_type, file_url, status, created_at, profiles(first_name, middle_name, last_name, student_number)"
          )
          .order("created_at", { ascending: false })
          .range(rangeStart, rangeStart + CREDENTIAL_PAGE_SIZE - 1);

        if (credentialsError) throw credentialsError;

        records.push(...(data ?? []));

        if (!data || data.length < CREDENTIAL_PAGE_SIZE) break;
        rangeStart += CREDENTIAL_PAGE_SIZE;
      }

      setCredentials(
        records.map((credential) => {
          const profile = credential.profiles;
          const alumni = [
            profile?.first_name,
            profile?.middle_name,
            profile?.last_name,
          ]
            .filter(Boolean)
            .join(" ");

          return {
            ...credential,
            alumni: alumni || "Unknown alumnus",
            studentNumber: profile?.student_number || "Student number unavailable",
            type: credential.credential_type,
            submitted: formatDate(credential.created_at),
            status: formatStatus(credential.status),
          };
        })
      );
    } catch (loadError) {
      console.error("Unable to load credential records:", loadError);
      setError(loadError.message || "Unable to load credential records.");
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCredentials();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredCredentials = useMemo(() => {
    return credentials.filter((credential) => {
      const value = search.toLowerCase().trim();

      const matchesSearch =
        credential.alumni.toLowerCase().includes(value) ||
        credential.studentNumber.toLowerCase().includes(value) ||
        credential.type.toLowerCase().includes(value);

      const matchesFilter =
        filter === "All" || credential.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [credentials, search, filter]);

  async function updateStatus(credential, status) {
    if (updatingId || credential.status !== "Pending") return;

    setUpdatingId(credential.id);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Your administrator session has expired.");

      const { data: updatedRows, error: updateError } = await supabase
        .from("credentials")
        .update({
          status: status.toLowerCase(),
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", credential.id)
        .eq("status", "pending")
        .select("id");

      if (updateError) throw updateError;
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error("This credential was already processed. Refreshing the queue.");
      }

      await loadCredentials();
    } catch (updateError) {
      console.error("Unable to update credential status:", updateError);
      setError(updateError.message || "Unable to update credential status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleView(credential) {
    if (viewingId) return;

    setViewingId(credential.id);
    setError("");

    const credentialWindow = window.open("about:blank", "_blank");

    if (!credentialWindow) {
      setError("Please allow pop-ups to view this credential file.");
      setViewingId(null);
      return;
    }

    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(credential.file_url, 60);

      if (signedUrlError) throw signedUrlError;
      if (!data?.signedUrl) throw new Error("Credential file URL was not created.");

      credentialWindow.location.href = data.signedUrl;
    } catch (viewError) {
      credentialWindow.close();
      console.error("Unable to view credential file:", viewError);
      setError(viewError.message || "Unable to view this credential file.");
    } finally {
      setViewingId(null);
    }
  };

  const pendingCount = credentials.filter(
    (credential) => credential.status === "Pending"
  ).length;

  const verifiedCount = credentials.filter(
    (credential) => credential.status === "Verified"
  ).length;

  const rejectedCount = credentials.filter(
    (credential) => credential.status === "Rejected"
  ).length;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      {/* Admin Header */}
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
              <ShieldCheck size={19} />
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
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28b1e]">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold md:text-4xl">
                Credential Verification
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Review documents submitted by alumni and verify their
                credentials before they are accepted into the alumni records.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8d2c2] bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7df] text-[#9a7b16]">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Pending Review
                  </p>

                  <p className="mt-0.5 font-serif text-2xl font-bold text-[#9a7b16]">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Verification Summary */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7df] text-[#9a7b16]">
                <Clock3 size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Pending
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5ef] text-[#286044]">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Verified
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {verifiedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9eded] text-[#a43a3a]">
                <XCircle size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Rejected
                </p>

                <p className="mt-1 font-serif text-2xl font-bold">
                  {rejectedCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
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
                Find submitted documents by alumni or credential type.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search alumni, student number, or credential..."
                className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm text-[#18392b] outline-none transition placeholder:text-gray-400 focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#18392b] focus:ring-2 focus:ring-[#18392b]/10"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </section>

        {/* Credential Records */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#e4dfd3] px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                <FileCheck2 size={20} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b28b1e]">
                  Verification Queue
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold">
                  Submitted Credentials
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Showing {filteredCredentials.length} of{" "}
                  {credentials.length} records
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#f7f5ee] px-4 py-2 text-xs font-semibold text-gray-500">
              {pendingCount} awaiting review
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#f7f5ee]">
                <tr className="border-b border-[#e4dfd3] text-[11px] uppercase tracking-[0.12em] text-gray-500">
                  <th className="px-5 py-4 font-bold lg:px-6">Alumni</th>
                  <th className="px-5 py-4 font-bold">Credential</th>
                  <th className="px-5 py-4 font-bold">Submitted</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee9df]">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center text-sm text-gray-500">
                      Loading credential records...
                    </td>
                  </tr>
                )}

                {!loading && filteredCredentials.map((credential) => (
                  <tr
                    key={credential.id}
                    className="group transition hover:bg-[#fbfaf6]"
                  >
                    <td className="px-5 py-5 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#18392b] font-serif text-sm font-bold text-[#d4af37]">
                          {getInitials(credential.alumni)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#18392b]">
                            {credential.alumni}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {credential.studentNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f5ee] text-[#18392b]">
                          <FileText size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            {credential.type}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Document submission
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {credential.submitted}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          credential.status === "Verified"
                            ? "bg-[#eef5ef] text-[#286044]"
                            : credential.status === "Rejected"
                              ? "bg-[#f9eded] text-[#a43a3a]"
                              : "bg-[#fff7df] text-[#9a7b16]"
                        }`}
                      >
                        {credential.status}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(credential)}
                          disabled={viewingId === credential.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#d8d2c2] px-3 py-2 text-xs font-bold text-[#18392b] transition hover:border-[#18392b] hover:bg-[#f7f5ee]"
                        >
                          <Eye size={15} />
                          {viewingId === credential.id ? "Opening..." : "View"}
                        </button>

                        {credential.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateStatus(credential, "Verified")}
                              disabled={updatingId === credential.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#286044] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#1f4d35]"
                            >
                              <CheckCircle2 size={15} />
                              Verify
                            </button>

                            <button
                              type="button"
                              onClick={() => updateStatus(credential, "Rejected")}
                              disabled={updatingId === credential.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#a43a3a] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#8d3030]"
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

                {!loading && filteredCredentials.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                        <FileCheck2 size={24} />
                      </div>

                      <h3 className="mt-4 font-serif text-lg font-bold">
                        No credential records found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search terms or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verification Information */}
        <section className="mt-7 overflow-hidden rounded-3xl bg-[#18392b] text-white shadow-sm">
          <div className="relative px-6 py-7 lg:px-8">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-[#d4af37]/20" />
            <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4af37]">
                      Verification Protocol
                    </p>

                    <h3 className="mt-1 font-serif text-xl font-bold">
                      Review every submitted credential carefully
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/65">
                  Verify that submitted documents contain the correct alumni
                  information and meet the requirements of the PLM College of
                  Accountancy alumni system.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs text-white/50">Current queue</p>

                <p className="mt-1 font-serif text-2xl font-bold text-[#d4af37]">
                  {pendingCount}
                </p>

                <p className="text-xs text-white/50">
                  pending credential{pendingCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
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
              className="font-semibold text-[#18392b] transition hover:text-[#b28b1e]"
            >
              Admin Dashboard
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
