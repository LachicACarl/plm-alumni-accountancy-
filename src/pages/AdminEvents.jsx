import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit3,
  ImagePlus,
  MapPin,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BUCKET = "event-images";

const emptyForm = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  location: "",
  image_url: "",
};

export default function AdminEvents() {
  const fileInputRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setEvents([]);
    } else {
      setEvents(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title ?? "",
      description: event.description ?? "",
      event_date: event.event_date ?? "",
      start_time: event.start_time ?? "",
      end_time: event.end_time ?? "",
      location: event.location ?? "",
      image_url: event.image_url ?? "",
    });
    setImageFile(null);
    setImagePreview(event.image_url ?? "");
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Event images must be 5MB or smaller.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function uploadImage(file) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `events/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.title.trim()) {
        throw new Error("Event title is required.");
      }

      if (!form.event_date) {
        throw new Error("Event date is required.");
      }

      let imageUrl = form.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        event_date: form.event_date,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        location: form.location.trim() || null,
        image_url: imageUrl,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingId);

        if (updateError) {
          throw updateError;
        }

        setSuccess("Event updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setSuccess("Event created successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (submitError) {
      setError(submitError.message || "Unable to save event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSuccess("Event deleted successfully.");

    if (editingId === id) {
      resetForm();
    }

    await loadEvents();
  }

  function formatDate(date) {
    if (!date) return "No date";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatTimeRange(start, end) {
    if (!start && !end) return "Time not specified";

    if (start && end) {
      return `${formatTime(start)} - ${formatTime(end)}`;
    }

    return formatTime(start || end);
  }

  return (
    <main className="min-h-screen bg-[#fbfaf5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#315f45] hover:text-[#9a7b1d]"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b28b1e]">
              Content Management
            </p>

            <h1 className="mt-1 font-serif text-4xl font-bold text-[#18392b]">
              Events Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736c]">
              Create, update, delete, and manage the images displayed on the
              public PLM BSA Alumni Events page.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] shadow-sm transition hover:-translate-y-0.5"
          >
            <Plus size={17} />
            New Event
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-[#cbdcc9] bg-[#edf6ea] px-4 py-3 text-sm font-medium text-[#315f45]">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="h-fit rounded-2xl border border-[#ded8c9] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                  {editingId ? "Edit Event" : "Create Event"}
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  {editingId ? "Update event" : "New event"}
                </h2>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-2 text-[#68736c] hover:bg-[#f1f3ed]"
                  aria-label="Cancel editing"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="event-title" className="text-xs font-bold text-[#315f45]">Event Title</label>

                <input
                  id="event-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none transition focus:border-[#b79a3b] focus:ring-2 focus:ring-[#d4af37]/20"
                  placeholder="BSA Alumni General Assembly"
                />
              </div>

              <div>
                <label htmlFor="event-description" className="text-xs font-bold text-[#315f45]">Description</label>

                <textarea
                  id="event-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none transition focus:border-[#b79a3b] focus:ring-2 focus:ring-[#d4af37]/20"
                  placeholder="Describe the event..."
                />
              </div>

              <div>
                <label htmlFor="event-date" className="text-xs font-bold text-[#315f45]">Event Date</label>

                <input
                  id="event-date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      event_date: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none transition focus:border-[#b79a3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="start-time" className="text-xs font-bold text-[#315f45]">Start Time</label>

                  <input
                    id="start-time"
                    type="time"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        start_time: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-3 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  />
                </div>

                <div>
                  <label htmlFor="end-time" className="text-xs font-bold text-[#315f45]">End Time</label>

                  <input
                    id="end-time"
                    type="time"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        end_time: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-3 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-location" className="text-xs font-bold text-[#315f45]">Location</label>

                <input
                  id="event-location"
                  value={form.location}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      location: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#d8ddd6] px-4 py-3 text-sm outline-none focus:border-[#b79a3b]"
                  placeholder="PLM College of Accountancy"
                />
              </div>

              <div>
                <label htmlFor="event-image" className="text-xs font-bold text-[#315f45]">Event Image</label>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b79a3b] bg-[#fffaf0] px-4 py-5 text-sm font-semibold text-[#315f45] transition hover:bg-[#fff4d5]"
                >
                  <ImagePlus size={18} />
                  {imageFile ? imageFile.name : "Choose event image"}
                </button>

                <input
                  id="event-image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="mt-1.5 text-[11px] text-[#7a837d]">
                  JPG, PNG, WEBP ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Maximum 5MB
                </p>
              </div>

              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-[#ded8c9]">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="h-44 w-full object-cover"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18392b] to-[#315f45] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Create Event"}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Published Content
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Existing Events
                </h2>
              </div>

              <span className="rounded-full bg-[#e8f0e5] px-3 py-1.5 text-xs font-bold text-[#315f45]">
                {events.length} events
              </span>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#ded8c9] bg-white p-8 text-center text-sm text-[#68736c]">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfc8b8] bg-white p-10 text-center">
                <CalendarDays
                  size={34}
                  className="mx-auto text-[#b79a3b]"
                />

                <h3 className="mt-4 font-serif text-xl font-bold text-[#18392b]">
                  No events yet
                </h3>

                <p className="mt-2 text-sm text-[#68736c]">
                  Create your first event using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-2xl border border-[#ded8c9] bg-white shadow-sm"
                  >
                    <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
                      <div className="h-44 bg-[#e8ece7] md:h-full">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#8b958e]">
                            <ImagePlus size={30} />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-[#18392b]">
                              {event.title}
                            </h3>

                            <div className="mt-3 space-y-1.5 text-xs text-[#68736c]">
                              <p className="flex items-center gap-2">
                                <CalendarDays size={14} className="text-[#9a7b1d]" />
                                {formatDate(event.event_date)}
                              </p>

                              <p className="flex items-center gap-2">
                                <Clock size={14} className="text-[#9a7b1d]" />
                                {formatTimeRange(
                                  event.start_time,
                                  event.end_time
                                )}
                              </p>

                              {event.location && (
                                <p className="flex items-center gap-2">
                                  <MapPin size={14} className="text-[#9a7b1d]" />
                                  {event.location}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(event)}
                              className="inline-flex items-center gap-2 rounded-lg border border-[#b79a3b] bg-white px-3 py-2 text-xs font-bold text-[#315f45] hover:bg-[#fff4d5]"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>

                        {event.description && (
                          <p className="mt-4 text-sm leading-6 text-[#68736c]">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
