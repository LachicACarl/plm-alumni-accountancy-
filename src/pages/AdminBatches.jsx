import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  GraduationCap,
  ImagePlus,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  Users,
  Award,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  year: "",
  description: "",
  highlights: "",
  image_url: "",
};

const emptyStudentForm = {
  full_name: "",
  student_number: "",
  block_label: "BSA 4-1",
  status: "",
  cpa_passed: "",
};

function getPublicImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const { data } = supabase.storage.from("batch-images").getPublicUrl(path);
  return data?.publicUrl || "";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentSaving, setStudentSaving] = useState(false);
  const [studentMessage, setStudentMessage] = useState("");

  const selectedBatch = batches.find((batch) => batch.id === selectedBatchId);

  const studentStats = useMemo(() => {
    const groups = ["BSA 4-1", "BSA 4-2", "BSA 4-3"];
    return groups.map((block) => {
      const members = students.filter((student) => student.block_label === block);
      return {
        block,
        count: members.length,
        passers: members.filter((student) => Boolean(student.cpa_passed)).length,
      };
    });
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    return students.filter((student) => {
      const matchesBlock =
        blockFilter === "all" || student.block_label === blockFilter;
      const matchesSearch =
        !query ||
        student.full_name.toLowerCase().includes(query) ||
        student.student_number.toLowerCase().includes(query);
      return matchesBlock && matchesSearch;
    });
  }, [students, studentSearch, blockFilter]);

  async function loadBatches() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("batches")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setBatches([]);
    } else {
      setBatches(data ?? []);
      const batch2025 = (data ?? []).find((batch) => batch.year === 2025);
      if (batch2025) setSelectedBatchId((current) => current || batch2025.id);
      else if (data?.length) setSelectedBatchId((current) => current || data[0].id);
    }

    setLoading(false);
  }

  async function loadStudents(batchId = selectedBatchId) {
    if (!batchId) {
      setStudents([]);
      return;
    }

    setStudentsLoading(true);
    setStudentMessage("");

    const { data, error } = await supabase
      .from("batch_students")
      .select("id, batch_id, full_name, student_number, status, cpa_passed, block_label, created_at")
      .eq("batch_id", batchId)
      .order("block_label", { ascending: true })
      .order("full_name", { ascending: true });

    if (error) {
      console.error(error);
      setStudentMessage(
        error.code === "PGRST205"
          ? "The batch_students table is not available through the Supabase Data API yet. Refresh the API schema in Supabase and try again."
          : error.message
      );
      setStudents([]);
    } else {
      setStudents(data ?? []);
    }

    setStudentsLoading(false);
  }

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) loadStudents(selectedBatchId);
  }, [selectedBatchId]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setMessage("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be 5MB or smaller.");
      return;
    }

    setMessage("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function startEdit(batch) {
    setEditingId(batch.id);
    setForm({
      year: String(batch.year ?? ""),
      description: batch.description ?? "",
      highlights: Array.isArray(batch.highlights)
        ? batch.highlights.join(", ")
        : batch.highlights ?? "",
      image_url: batch.image_url ?? "",
    });

    setImageFile(null);
    setImagePreview(getPublicImageUrl(batch.image_url));
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file, year) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${year}-${Date.now()}.${extension}`;
    const filePath = `batches/${fileName}`;

    const { error } = await supabase.storage
      .from("batch-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("batch-images").getPublicUrl(filePath);
    return data?.publicUrl || "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const year = Number(form.year);

    if (!year || year < 1900 || year > 2100) {
      setMessage("Please enter a valid batch year.");
      return;
    }
    if (!form.description.trim()) {
      setMessage("Please enter a batch description.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let imageUrl = form.image_url || null;
      if (imageFile) imageUrl = await uploadImage(imageFile, year);

      const payload = {
        year,
        description: form.description.trim(),
        highlights: form.highlights
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        image_url: imageUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from("batches")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setMessage("Batch updated successfully.");
      } else {
        const { error } = await supabase.from("batches").insert(payload);
        if (error) throw error;
        setMessage("Batch created successfully.");
      }

      resetForm();
      await loadBatches();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to save batch.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(batch) {
    const confirmed = window.confirm(
      `Delete BSA Batch ${batch.year}? Its student roster will also be deleted.`
    );
    if (!confirmed) return;

    setMessage("");
    const { error } = await supabase.from("batches").delete().eq("id", batch.id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    if (editingId === batch.id) resetForm();
    if (selectedBatchId === batch.id) {
      setSelectedBatchId("");
      setStudents([]);
    }
    await loadBatches();
  }

  function resetStudentForm() {
    setStudentForm(emptyStudentForm);
    setEditingStudentId(null);
    setStudentMessage("");
  }

  function startEditStudent(student) {
    setEditingStudentId(student.id);
    setStudentForm({
      full_name: student.full_name ?? "",
      student_number: student.student_number ?? "",
      block_label: student.block_label ?? "BSA 4-1",
      status: student.status ?? "",
      cpa_passed: student.cpa_passed ?? "",
    });
    setStudentMessage("");
    document.getElementById("student-roster-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    if (!selectedBatchId) {
      setStudentMessage("Select a batch before adding a student.");
      return;
    }
    if (!studentForm.full_name.trim() || !studentForm.student_number.trim()) {
      setStudentMessage("Student name and student number are required.");
      return;
    }

    setStudentSaving(true);
    setStudentMessage("");

    const payload = {
      batch_id: selectedBatchId,
      full_name: studentForm.full_name.trim(),
      student_number: studentForm.student_number.trim(),
      block_label: studentForm.block_label,
      status: studentForm.status.trim() || null,
      cpa_passed: studentForm.cpa_passed.trim() || null,
    };

    const request = editingStudentId
      ? supabase.from("batch_students").update(payload).eq("id", editingStudentId)
      : supabase.from("batch_students").insert(payload);

    const { error } = await request;
    if (error) {
      console.error(error);
      setStudentMessage(
        error.code === "23505"
          ? "That student number is already assigned to another roster record."
          : error.message
      );
    } else {
      setStudentMessage(
        editingStudentId ? "Student record updated." : "Student added to the batch."
      );
      resetStudentForm();
      await loadStudents(selectedBatchId);
    }

    setStudentSaving(false);
  }

  async function handleDeleteStudent(student) {
    const confirmed = window.confirm(
      `Remove ${student.full_name} (${student.student_number}) from this batch roster?`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("batch_students")
      .delete()
      .eq("id", student.id);

    if (error) {
      console.error(error);
      setStudentMessage(error.message);
      return;
    }

    if (editingStudentId === student.id) resetStudentForm();
    setStudentMessage("Student removed from the batch roster.");
    await loadStudents(selectedBatchId);
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="border-b border-[#ddd8c9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
              PLM College of Accountancy
            </p>
            <h1 className="mt-1 text-2xl font-black">Batch Management</h1>
            <p className="mt-1 text-sm text-[#68736b]">
              Manage alumni batches, student rosters, and batch images.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-[#d8ddd6] bg-white px-4 py-2.5 text-sm font-bold text-[#315f45] transition hover:bg-[#f7f5ee]"
          >
            <ArrowLeft size={17} />
            Back to Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-[#ddd8c9] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b28b1e]">
                  {editingId ? "Edit Batch" : "Add Batch"}
                </p>
                <h2 className="mt-1 text-xl font-black">
                  {editingId ? "Update batch" : "Create a batch"}
                </h2>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-2 text-[#68736b] transition hover:bg-[#f3f1e8]"
                  aria-label="Cancel editing"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="batch-year" className="text-xs font-bold text-[#315f45]">
                  Batch Year
                </label>
                <input
                  id="batch-year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, year: event.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="2026"
                  required
                />
              </div>

              <div>
                <label htmlFor="batch-description" className="text-xs font-bold text-[#315f45]">
                  Description
                </label>
                <textarea
                  id="batch-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="Describe this alumni batch..."
                  required
                />
              </div>

              <div>
                <label htmlFor="batch-highlights" className="text-xs font-bold text-[#315f45]">
                  Highlights
                </label>
                <textarea
                  id="batch-highlights"
                  value={form.highlights}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, highlights: event.target.value }))
                  }
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="CPA passers, Industry professionals, Entrepreneurs"
                />
                <p className="mt-1.5 text-[11px] text-[#7a837d]">
                  Separate each highlight with a comma.
                </p>
              </div>

              <div>
                <label htmlFor="batch-image" className="text-xs font-bold text-[#315f45]">
                  Batch Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b79a3b] bg-[#fffaf0] px-4 py-5 text-sm font-semibold text-[#315f45] transition hover:bg-[#fff4d5]"
                >
                  <ImagePlus size={18} />
                  {imageFile ? imageFile.name : "Choose batch image"}
                </button>
                <input
                  id="batch-image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="mt-1.5 text-[11px] text-[#7a837d]">JPG, PNG, WEBP • Maximum 5MB</p>
              </div>

              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-[#ded8c9]">
                  <img src={imagePreview} alt="Batch preview" className="h-44 w-full object-cover" />
                </div>
              )}

              {message && (
                <div role="alert" className="rounded-xl border border-[#ded8c9] bg-[#fffaf0] px-4 py-3 text-sm text-[#315f45]">
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18392b] to-[#315f45] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingId ? <Save size={17} /> : <Plus size={17} />}
                  {saving ? "Saving..." : editingId ? "Update Batch" : "Add Batch"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm font-bold text-[#315f45] hover:bg-[#f7f5ee]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b28b1e]">
                  Existing Batches
                </p>
                <h2 className="mt-1 text-xl font-black">Alumni batches</h2>
              </div>
              <span className="rounded-full bg-[#e8eee9] px-3 py-1.5 text-xs font-bold text-[#315f45]">
                {batches.length} batches
              </span>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#ddd8c9] bg-white p-8 text-center text-sm text-[#68736b]">
                Loading batches...
              </div>
            ) : batches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfc8b5] bg-white p-10 text-center">
                <GraduationCap size={38} className="mx-auto text-[#b79a3b]" />
                <h3 className="mt-3 font-black">No batches found</h3>
                <p className="mt-1 text-sm text-[#68736b]">
                  Create your first alumni batch using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => {
                  const imageUrl = getPublicImageUrl(batch.image_url);
                  const isSelected = selectedBatchId === batch.id;

                  return (
                    <article
                      key={batch.id}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                        isSelected ? "border-[#b79a3b]" : "border-[#ddd8c9]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="h-44 w-full shrink-0 bg-[#e8eee9] sm:w-56">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={`BSA Batch ${batch.year}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <GraduationCap size={42} className="text-[#b79a3b]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b28b1e]">
                                BSA Batch
                              </p>
                              <h3 className="mt-1 text-2xl font-black text-[#18392b]">
                                {batch.year}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedBatchId(batch.id)}
                                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                                  isSelected
                                    ? "bg-[#e8eee9] text-[#315f45]"
                                    : "border border-[#d8ddd6] text-[#315f45] hover:bg-[#f7f5ee]"
                                }`}
                              >
                                {isSelected ? "Selected" : "View roster"}
                              </button>
                              <button
                                type="button"
                                onClick={() => startEdit(batch)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8ddd6] px-3 py-2 text-xs font-bold text-[#315f45] hover:bg-[#f7f5ee]"
                              >
                                <Edit3 size={15} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(batch)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={15} /> Delete
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#68736b]">{batch.description}</p>
                          {Array.isArray(batch.highlights) && batch.highlights.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {batch.highlights.map((highlight, index) => (
                                <span
                                  key={`${batch.id}-${index}`}
                                  className="rounded-full bg-[#f1ead9] px-3 py-1.5 text-xs font-semibold text-[#315f45]"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#ddd8c9] bg-white shadow-sm">
          <div className="border-b border-[#e9e4d6] bg-[#fbfaf5] px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b28b1e]">
                  Student Records
                </p>
                <h2 className="mt-1 text-xl font-black">Batch roster management</h2>
                <p className="mt-1 text-sm text-[#68736b]">
                  Search, filter, add, edit, and remove student roster entries.
                </p>
              </div>
              {selectedBatch && (
                <span className="rounded-full bg-[#e8eee9] px-3 py-1.5 text-xs font-bold text-[#315f45]">
                  Batch {selectedBatch.year}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-3 border-b border-[#eee9dc] p-6 sm:grid-cols-3">
            {studentStats.map((stat) => (
              <div key={stat.block} className="rounded-xl border border-[#e3decf] bg-[#fbfaf5] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a19]">{stat.block}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-[#18392b]">{stat.count}</p>
                    <p className="text-xs text-[#68736b]">Students</p>
                  </div>
                  <div className="text-right">
                    <p className="inline-flex items-center gap-1 text-lg font-bold text-[#315f45]">
                      <Award size={16} /> {stat.passers}
                    </p>
                    <p className="text-xs text-[#68736b]">CPA passers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 p-6 xl:grid-cols-[320px_1fr]">
            <form
              id="student-roster-form"
              onSubmit={handleStudentSubmit}
              className="h-fit space-y-4 rounded-xl border border-[#e3decf] bg-[#fbfaf5] p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a19]">
                    {editingStudentId ? "Edit Student" : "Add Student"}
                  </p>
                  <h3 className="mt-1 font-black text-[#18392b]">
                    {editingStudentId ? "Update roster entry" : "New roster entry"}
                  </h3>
                </div>
                {editingStudentId && (
                  <button
                    type="button"
                    onClick={resetStudentForm}
                    className="rounded-lg p-2 text-[#68736b] hover:bg-[#f0ede3]"
                    aria-label="Cancel student edit"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="student-name" className="mb-1 block text-xs font-bold text-[#315f45]">
                  Full name
                </label>
                <input
                  id="student-name"
                  value={studentForm.full_name}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, full_name: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm"
                  placeholder="Student full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="student-number" className="mb-1 block text-xs font-bold text-[#315f45]">
                  Student number
                </label>
                <input
                  id="student-number"
                  value={studentForm.student_number}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, student_number: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm"
                  placeholder="2020-00000"
                  required
                />
              </div>

              <div>
                <label htmlFor="student-block" className="mb-1 block text-xs font-bold text-[#315f45]">
                  Block
                </label>
                <select
                  id="student-block"
                  value={studentForm.block_label}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, block_label: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm"
                >
                  <option value="BSA 4-1">BSA 4-1</option>
                  <option value="BSA 4-2">BSA 4-2</option>
                  <option value="BSA 4-3">BSA 4-3</option>
                </select>
              </div>

              <div>
                <label htmlFor="student-status" className="mb-1 block text-xs font-bold text-[#315f45]">
                  Status (optional)
                </label>
                <input
                  id="student-status"
                  value={studentForm.status}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, status: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm"
                  placeholder="Enter status"
                />
              </div>

              <div>
                <label htmlFor="student-cpa" className="mb-1 block text-xs font-bold text-[#315f45]">
                  CPA pass date / note
                </label>
                <input
                  id="student-cpa"
                  value={studentForm.cpa_passed}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, cpa_passed: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm"
                  placeholder="e.g. 2026 May CPALE"
                />
              </div>

              {studentMessage && (
                <p role="status" className="rounded-lg border border-[#e3decf] bg-white p-3 text-xs text-[#315f45]">
                  {studentMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={studentSaving || !selectedBatchId}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#18392b] to-[#315f45] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {editingStudentId ? <Save size={16} /> : <Plus size={16} />}
                {studentSaving ? "Saving..." : editingStudentId ? "Update Student" : "Add Student"}
              </button>

              {editingStudentId && (
                <button
                  type="button"
                  onClick={resetStudentForm}
                  className="w-full rounded-lg border border-[#d8ddd6] px-4 py-2.5 text-sm font-bold text-[#315f45]"
                >
                  Cancel
                </button>
              )}
            </form>

            <div className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 md:flex-row">
                <label className="relative flex-1">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#879188]" />
                  <input
                    value={studentSearch}
                    onChange={(event) => setStudentSearch(event.target.value)}
                    className="w-full rounded-xl border border-[#d8ddd6] bg-white py-3 pl-10 pr-4 text-sm"
                    placeholder="Search by name or student number"
                  />
                </label>
                <select
                  value={blockFilter}
                  onChange={(event) => setBlockFilter(event.target.value)}
                  className="rounded-xl border border-[#d8ddd6] bg-white px-4 py-3 text-sm"
                  aria-label="Filter by block"
                >
                  <option value="all">All blocks</option>
                  <option value="BSA 4-1">BSA 4-1</option>
                  <option value="BSA 4-2">BSA 4-2</option>
                  <option value="BSA 4-3">BSA 4-3</option>
                </select>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-[#68736b]">
                <span className="inline-flex items-center gap-2">
                  <Users size={15} /> {filteredStudents.length} of {students.length} students
                </span>
                {selectedBatch && <span>Batch {selectedBatch.year}</span>}
              </div>

              {studentMessage && !editingStudentId && (
                <p role="alert" className="mb-3 rounded-lg border border-[#e3decf] bg-[#fffaf0] p-3 text-sm text-[#315f45]">
                  {studentMessage}
                </p>
              )}

              {studentsLoading ? (
                <div className="rounded-xl border border-[#e3decf] p-8 text-center text-sm text-[#68736b]">
                  Loading student roster...
                </div>
              ) : !selectedBatchId ? (
                <div className="rounded-xl border border-dashed border-[#d8ddd6] p-8 text-center text-sm text-[#68736b]">
                  Select a batch above to view its roster.
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d8ddd6] p-8 text-center text-sm text-[#68736b]">
                  No students match the selected search or filter.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#e3decf]">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-[#f5f2e8] text-xs uppercase tracking-wide text-[#53665b]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Student No.</th>
                        <th className="px-4 py-3">Block</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">CPA Pass</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee9dc]">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="bg-white hover:bg-[#fbfaf5]">
                          <td className="px-4 py-3 font-semibold text-[#18392b]">{student.full_name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#53665b]">{student.student_number}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{student.block_label}</td>
                          <td className="px-4 py-3">{student.status || "—"}</td>
                          <td className="px-4 py-3">{student.cpa_passed || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditStudent(student)}
                                className="rounded-lg border border-[#d8ddd6] p-2 text-[#315f45] hover:bg-[#f7f5ee]"
                                aria-label={`Edit ${student.full_name}`}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(student)}
                                className="rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50"
                                aria-label={`Delete ${student.full_name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
