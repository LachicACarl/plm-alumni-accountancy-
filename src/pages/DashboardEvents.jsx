import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import { getEvents } from "../lib/api";

function formatDate(date) {
  if (!date) return "Date to be announced";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(start, end) {
  const format = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const startTime = format(start);
  const endTime = format(end);
  if (startTime && endTime) return `${startTime} – ${endTime}`;
  return startTime || endTime || "Time to be announced";
}

export default function DashboardEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getEvents()
      .then((data) => {
        if (mounted) setEvents(data);
      })
      .catch((loadError) => {
        console.error("Failed to load alumni events:", loadError);
        if (mounted) setError("Unable to load events. Please try again later.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-5 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm text-[#18392b] hover:underline"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <h1 className="font-serif text-3xl font-bold text-[#18392b]">
              Alumni Events
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Discover events and reconnect with the alumni community.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
          <section className="mb-7 rounded-2xl bg-[#18392b] p-6 text-white shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  BSA Alumni Community
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold">
                  Stay Connected
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Find alumni activities, professional events, and community
                  gatherings organized by the PLM College of Accountancy.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
                <CalendarDays size={28} />
              </div>
            </div>
          </section>

          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                Events
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Alumni Activities
              </h2>
            </div>
            {!loading && !error && (
              <span className="text-sm text-gray-500">
                {events.length} {events.length === 1 ? "event" : "events"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-8 text-center text-sm text-gray-500">
              Loading events...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700"
            >
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-[#ddd7c8] bg-white p-8 text-center text-sm text-gray-500">
              No events available yet. Check back for upcoming alumni activities.
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <CalendarDays size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-xl font-bold text-[#18392b]">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(event.event_date)}
                        </p>
                        {(event.start_time || event.end_time) && (
                          <p className="flex items-center gap-2">
                            <Clock size={15} />
                            {formatTime(event.start_time, event.end_time)}
                          </p>
                        )}
                        {event.location && (
                          <p className="flex items-center gap-2">
                            <MapPin size={15} />
                            {event.location}
                          </p>
                        )}
                      </div>

                      <Link
                        to="/events"
                        className="mt-5 inline-flex rounded-lg bg-[#18392b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24513d]"
                      >
                        View Events
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <section className="mt-7 rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#18392b]">
                  Want to see more?
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse the public events page for the complete alumni
                  calendar.
                </p>
              </div>

              <Link
                to="/events"
                className="rounded-lg border border-[#18392b] px-5 py-3 text-sm font-semibold text-[#18392b] transition hover:bg-[#18392b] hover:text-white"
              >
                Public Events
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
