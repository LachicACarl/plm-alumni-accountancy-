import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  GraduationCap,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  year: "",
  description: "",
  highlights: "",
  image_url: "",
};

function getPublicImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { data } = supabase.storage
    .from("batch-images")
    .getPublicUrl(path);

  return data?.publicUrl || "";
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
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBatches();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage(file, year) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${year}-${Date.now()}.${extension}`;
    const filePath = `batches/${fileName}`;

    const { error } = await supabase.storage
      .from("batch-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("batch-images")
      .getPublicUrl(filePath);

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

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, year);
      }

      const highlights = form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        year,
        description: form.description.trim(),
        highlights,
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
        const { error } = await supabase
          .from("batches")
          .insert(payload);

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
      `Delete BSA Batch ${batch.year}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("batches")
      .delete()
      .eq("id", batch.id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    if (editingId === batch.id) {
      resetForm();
    }

    await loadBatches();
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="border-b border-[#ddd8c9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
              PLM College of Accountancy
            </p>
            <h1 className="mt-1 text-2xl font-black">
              Batch Management
            </h1>
            <p className="mt-1 text-sm text-[#68736b]">
              Manage alumni batches and their images.
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

      <main className="mx-auto max-w-7xl px-6 py-8">
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
                <label
                  htmlFor="batch-year"
                  className="text-xs font-bold text-[#315f45]"
                >
                  Batch Year
                </label>
                <input
                  id="batch-year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      year: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="2026"
                />
              </div>

              <div>
                <label
                  htmlFor="batch-description"
                  className="text-xs font-bold text-[#315f45]"
                >
                  Description
                </label>
                <textarea
                  id="batch-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="Describe this alumni batch..."
                />
              </div>

              <div>
                <label
                  htmlFor="batch-highlights"
                  className="text-xs font-bold text-[#315f45]"
                >
                  Highlights
                </label>
                <textarea
                  id="batch-highlights"
                  value={form.highlights}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      highlights: e.target.value,
                    }))
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
                <label
                  htmlFor="batch-image"
                  className="text-xs font-bold text-[#315f45]"
                >
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

                <p className="mt-1.5 text-[11px] text-[#7a837d]">
                  JPG, PNG, WEBP • Maximum 5MB
                </p>
              </div>

              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-[#ded8c9]">
                  <img
                    src={imagePreview}
                    alt="Batch preview"
                    className="h-44 w-full object-cover"
                  />
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-[#ded8c9] bg-[#fffaf0] px-4 py-3 text-sm text-[#315f45]">
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18392b] to-[#315f45] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingId ? (
                    <Save size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Batch"
                      : "Add Batch"}
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
                <h2 className="mt-1 text-xl font-black">
                  Alumni batches
                </h2>
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
                <GraduationCap
                  size={38}
                  className="mx-auto text-[#b79a3b]"
                />
                <h3 className="mt-3 font-black">
                  No batches found
                </h3>
                <p className="mt-1 text-sm text-[#68736b]">
                  Create your first alumni batch using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => {
                  const imageUrl = getPublicImageUrl(batch.image_url);

                  return (
                    <article
                      key={batch.id}
                      className="overflow-hidden rounded-2xl border border-[#ddd8c9] bg-white shadow-sm"
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
                              <GraduationCap
                                size={42}
                                className="text-[#b79a3b]"
                              />
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

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(batch)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8ddd6] px-3 py-2 text-xs font-bold text-[#315f45] hover:bg-[#f7f5ee]"
                              >
                                <Edit3 size={15} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(batch)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            </div>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-[#68736b]">
                            {batch.description}
                          </p>

                          {Array.isArray(batch.highlights) &&
                            batch.highlights.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {batch.highlights.map(
                                  (highlight, index) => (
                                    <span
                                      key={`${batch.id}-${index}`}
                                      className="rounded-full bg-[#f1ead9] px-3 py-1.5 text-xs font-semibold text-[#315f45]"
                                    >
                                      {highlight}
                                    </span>
                                  )
                                )}
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
      </main>
    </div>
  );
}
