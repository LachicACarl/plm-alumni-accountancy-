import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Menu,
  Upload,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Credentials() {
  const credentials = [
    {
      name: "Certificate of Graduation",
      type: "Academic",
      date: "June 15, 2025",
      status: "Verified",
    },
    {
      name: "Transcript of Records",
      type: "Academic",
      date: "June 18, 2025",
      status: "Verified",
    },
    {
      name: "Professional Identification",
      type: "Professional",
      date: "July 02, 2025",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm text-[#18392b] hover:underline"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>
              <h1 className="font-serif text-3xl font-bold text-[#18392b]">
                My Credentials
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your submitted alumni credentials.
              </p>
            </div>

            <button className="hidden items-center gap-2 rounded-lg bg-[#18392b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24513d] sm:flex">
              <Upload size={17} />
              Upload Credential
            </button>

            <button className="rounded-lg border border-gray-300 p-3 sm:hidden">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="mb-6 rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#18392b]">
                  Credential Verification
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Verified credentials are reviewed and approved by the
                  College of Accountancy.
                </p>
              </div>

              <div className="rounded-xl bg-[#eef5ef] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-[#18392b]">2 / 3</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {credentials.map((credential) => {
              const verified = credential.status === "Verified";

              return (
                <div
                  key={credential.name}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                        <FileCheck2 size={23} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#18392b]">
                          {credential.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {credential.type} • Submitted {credential.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          verified
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
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
                        <button className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50">
                          <Download size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9dc] text-[#18392b]">
              <Upload size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-[#18392b]">
              Upload a new credential
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Submit certificates, professional documents, or other
              credentials for verification by the College of Accountancy.
            </p>

            <button className="mt-5 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:bg-[#c39e2f]">
              Choose File
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
