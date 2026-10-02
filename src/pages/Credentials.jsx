import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Upload,
  ShieldCheck,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Credentials() {
  const credentials = [
    {
      name: "Certificate of Graduation",
      type: "Academic",
      date: "June 15, 2025",
      status: "Verified",
      icon: GraduationCap,
    },
    {
      name: "Transcript of Records",
      type: "Academic",
      date: "June 18, 2025",
      status: "Verified",
      icon: FileText,
    },
    {
      name: "Professional Identification",
      type: "Professional",
      date: "July 02, 2025",
      status: "Pending",
      icon: BriefcaseBusiness,
    },
  ];

  const verifiedCount = credentials.filter(
    (credential) => credential.status === "Verified"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#18392b] transition hover:text-[#b28b1e]"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b806b]">
                Alumni Portal
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-[#18392b]">
                My Credentials
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage and track your submitted alumni credentials and their
                verification status.
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5 sm:flex"
            >
              <Upload size={17} />
              Upload Credential
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          {/* Verification Hero */}
          <section className="overflow-hidden rounded-3xl bg-[#18392b] shadow-sm">
            <div className="relative p-7 lg:p-8">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute -right-5 -bottom-24 h-48 w-48 rounded-full border border-[#d4af37]/20" />

              <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37] text-[#18392b]">
                    <ShieldCheck size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      Credential Verification
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                      Your alumni records
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                      Verified credentials are reviewed and approved by the
                      College of Accountancy.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/10 px-7 py-5 text-center backdrop-blur-sm">
                  <p className="font-serif text-3xl font-bold text-[#d4af37]">
                    {verifiedCount} / {credentials.length}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Credential Summary */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                  <FileCheck2 size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Total Credentials
                  </p>

                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {credentials.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5ef] text-[#18392b]">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Verified
                  </p>

                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {verifiedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7df] text-[#a07810]">
                  <Clock3 size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Pending Review
                  </p>

                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {credentials.length - verifiedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <section className="mt-8">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                Submitted Documents
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Your Credentials
              </h2>
            </div>

            <div className="space-y-4">
              {credentials.map((credential) => {
                const verified = credential.status === "Verified";
                const Icon = credential.icon;

                return (
                  <article
                    key={credential.name}
                    className="group rounded-3xl border border-[#ddd7c8] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md lg:p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                          <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/30" />
                          <Icon size={25} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg font-bold text-[#18392b]">
                              {credential.name}
                            </h3>

                            <span className="rounded-full bg-[#f7f5ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8b806b]">
                              {credential.type}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            Submitted {credential.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold ${
                            verified
                              ? "bg-[#eef5ef] text-[#286044]"
                              : "bg-[#fff7df] text-[#a07810]"
                          }`}
                        >
                          {verified ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock3 size={14} />
                          )}

                          {credential.status}
                        </span>

                        {verified && (
                          <button
                            type="button"
                            title="Download credential"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ddd7c8] text-[#18392b] transition hover:border-[#b28b1e] hover:bg-[#faf9f5]"
                          >
                            <Download size={17} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Upload Area */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-8 text-center lg:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
              <Upload size={27} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
              Add Credential
            </p>

            <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
              Upload a new credential
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Submit certificates, professional documents, or other credentials
              for verification by the College of Accountancy.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-6 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5"
            >
              <Upload size={17} />
              Choose File
            </button>
          </section>

          {/* Information Notice */}
          <section className="mt-7 rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#18392b]" size={19} />

              <div>
                <p className="text-sm font-semibold text-[#18392b]">
                  Verification Information
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Credential status is managed through the alumni verification
                  process. Please make sure submitted documents are clear and
                  complete.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
