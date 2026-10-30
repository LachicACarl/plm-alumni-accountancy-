import { useEffect, useState } from "react";
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
  X,
  AlertCircle,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import { supabase } from "../lib/supabase";

const BUCKET = "alumni-credentials";

function getIcon(type = "") {
  const value = type.toLowerCase();
  if (value.includes("professional") || value.includes("license")) {
    return BriefcaseBusiness;
  }
  if (value.includes("graduation")) return GraduationCap;
  return FileText;
}

function formatDate(value) {
  if (!value) return "Date not available";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [credentialType, setCredentialType] = useState("Academic");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function loadCredentials() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Your session has expired. Please log in again.");

      const { data, error: credentialsError } = await supabase
        .from("credentials")
        .select(
          "id, credential_type, file_url, status, remarks, verified_at, created_at"
        )
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (credentialsError) throw credentialsError;

      setCredentials(data ?? []);
    } catch (err) {
      setError(err.message || "Unable to load your credentials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  const verifiedCount = credentials.filter(
    (item) => item.status === "verified"
  ).length;

  const pendingCount = credentials.filter(
    (item) => item.status === "pending"
  ).length;

  function openUpload() {
    setUploadError("");
    setSelectedFile(null);
    setShowUpload(true);
  }

  function closeUpload() {
    if (uploading) return;
    setShowUpload(false);
    setSelectedFile(null);
    setUploadError("");
  }

  async function handleUpload(event) {
    event.preventDefault();
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Please choose a file first.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File size must be 10 MB or less.");
      return;
    }

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Your session has expired. Please log in again.");

      const safeName = selectedFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const path = `${user.id}/${Date.now()}-${safeName}`;

      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .upload(path, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) throw storageError;

      const { error: databaseError } = await supabase
        .from("credentials")
        .insert({
          profile_id: user.id,
          credential_type: credentialType,
          file_url: path,
          status: "pending",
        });

      if (databaseError) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw databaseError;
      }

      closeUpload();
      await loadCredentials();
    } catch (err) {
      setUploadError(err.message || "Unable to upload the credential.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(credential) {
    setError("");

    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(credential.file_url, 60);

      if (signedUrlError) throw signedUrlError;

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message || "Unable to download this credential.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <div>
              <Link
                to="/dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#18392b] hover:text-[#b28b1e]"
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
              onClick={openUpload}
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] hover:-translate-y-0.5 sm:flex"
            >
              <Upload size={17} />
              Upload Credential
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          <section className="overflow-hidden rounded-3xl bg-[#18392b] shadow-sm">
            <div className="relative p-7 lg:p-8">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
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

                <div className="rounded-2xl border border-white/10 bg-white/10 px-7 py-5 text-center">
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

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <FileCheck2 size={21} className="text-[#18392b]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Total Credentials
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {loading ? "—" : credentials.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={21} className="text-[#286044]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Verified
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {loading ? "—" : verifiedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock3 size={21} className="text-[#a07810]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Pending Review
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                    {loading ? "—" : pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
              Submitted Documents
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
              Your Credentials
            </h2>

            <div className="mt-5 space-y-4">
              {loading ? (
                <div className="rounded-3xl border border-[#ddd7c8] bg-white p-8 text-center text-sm text-gray-500">
                  Loading your credentials...
                </div>
              ) : credentials.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#c9c1ad] bg-white p-10 text-center">
                  <FileCheck2 className="mx-auto text-[#18392b]" size={34} />
                  <h3 className="mt-4 font-serif text-xl font-bold text-[#18392b]">
                    No credentials submitted yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    Upload your first credential to start the verification
                    process.
                  </p>
                </div>
              ) : (
                credentials.map((credential) => {
                  const status = credential.status || "pending";
                  const verified = status === "verified";
                  const rejected = status === "rejected";
                  const Icon = getIcon(credential.credential_type);

                  return (
                    <article
                      key={credential.id}
                      className="rounded-3xl border border-[#ddd7c8] bg-white p-5 shadow-sm lg:p-6"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eee9dc] text-[#18392b]">
                            <Icon size={25} />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-lg font-bold text-[#18392b]">
                                {credential.credential_type}
                              </h3>

                              <span className="rounded-full bg-[#f7f5ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8b806b]">
                                Credential
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                              Submitted {formatDate(credential.created_at)}
                            </p>

                            {credential.remarks && (
                              <p className="mt-1 text-sm text-gray-500">
                                {credential.remarks}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold ${
                              verified
                                ? "bg-[#eef5ef] text-[#286044]"
                                : rejected
                                  ? "bg-red-50 text-red-700"
                                  : "bg-[#fff7df] text-[#a07810]"
                            }`}
                          >
                            {verified ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}

                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>

                          {verified && credential.file_url && (
                            <button
                              type="button"
                              onClick={() => handleDownload(credential)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ddd7c8] text-[#18392b] hover:border-[#b28b1e]"
                              title="Download credential"
                            >
                              <Download size={17} />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-8 text-center lg:p-10">
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
              onClick={openUpload}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-6 py-3 text-sm font-bold text-[#18392b]"
            >
              <Upload size={17} />
              Choose File
            </button>
          </section>
        </div>
      </main>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                  New Submission
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Upload Credential
                </h2>
              </div>

              <button
                type="button"
                onClick={closeUpload}
                disabled={uploading}
                className="rounded-xl p-2 text-gray-500 hover:bg-[#f7f5ee]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                  Credential Type
                </label>

                <select
                  value={credentialType}
                  onChange={(event) => setCredentialType(event.target.value)}
                  className="w-full rounded-xl border border-[#d8d1c2] bg-white px-4 py-3 text-sm"
                >
                  <option>Academic</option>
                  <option>Certificate</option>
                  <option>Professional</option>
                  <option>Award</option>
                  <option>Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18392b]">
                  File
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] || null)
                  }
                  className="block w-full rounded-xl border border-dashed border-[#c9c1ad] bg-[#fbfaf6] p-4 text-sm"
                />

                <p className="mt-2 text-xs text-gray-400">
                  PDF, JPG, PNG, or WEBP. Maximum 10 MB.
                </p>
              </div>

              {selectedFile && (
                <div className="rounded-xl bg-[#f7f5ee] px-4 py-3 text-sm text-[#18392b]">
                  Selected: <strong>{selectedFile.name}</strong>
                </div>
              )}

              {uploadError && (
                <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={17} />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeUpload}
                  disabled={uploading}
                  className="rounded-xl border border-[#d8d1c2] px-5 py-3 text-sm font-semibold text-[#18392b]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] disabled:opacity-60"
                >
                  <Upload size={17} />
                  {uploading ? "Uploading..." : "Submit Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
