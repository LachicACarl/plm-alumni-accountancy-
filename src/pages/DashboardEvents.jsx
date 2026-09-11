import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Menu,
  Users,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardEvents() {
  const events = [
    {
      title: "BSA Alumni General Assembly",
      date: "June 20, 2026",
      time: "9:00 AM – 12:00 PM",
      location: "PLM College of Accountancy",
      type: "Alumni Gathering",
      attendees: 85,
    },
    {
      title: "Accountancy Career Talk",
      date: "July 11, 2026",
      time: "1:00 PM – 4:00 PM",
      location: "PLM Main Campus",
      type: "Career Development",
      attendees: 120,
    },
    {
      title: "BSA Alumni Sports Day",
      date: "August 15, 2026",
      time: "8:00 AM – 5:00 PM",
      location: "PLM Sports Complex",
      type: "Community",
      attendees: 150,
    },
    {
      title: "BSA Alumni Homecoming",
      date: "April 18, 2026",
      time: "10:00 AM – 4:00 PM",
      location: "PLM College of Accountancy",
      type: "Homecoming",
      attendees: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5">
          <div>
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
              Discover upcoming events and reconnect with the alumni community.
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <section className="mb-8 rounded-2xl bg-[#18392b] p-7 text-white shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  BSA Alumni Community
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold">
                  Stay Connected
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Attend alumni activities, professional events, and community
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

            <span className="text-sm text-gray-500">
              {events.length} events
            </span>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.title}
                className="rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex gap-5">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                    <CalendarDays size={20} />
                    <span className="mt-1 text-[10px] font-bold uppercase">
                      2026
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-[#eef5ef] px-3 py-1 text-xs font-semibold text-[#18392b]">
                      {event.type}
                    </span>

                    <h3 className="mt-3 font-serif text-xl font-bold text-[#18392b]">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {event.date}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock size={15} />
                        {event.time}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={15} />
                        {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users size={15} />
                        {event.attendees} alumni expected
                      </p>
                    </div>

                    <button className="mt-5 rounded-lg bg-[#18392b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24513d]">
                      View Event
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-2xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
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

          <button className="mt-5 rounded-lg border border-gray-300 p-3 sm:hidden">
            <Menu size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
