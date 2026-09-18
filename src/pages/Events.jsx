import { CalendarDays, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import plmCampus from "../assets/plm-campus.jpg";
import eventImage from "../assets/1.jpg";

const events = [
  {
    title: "BSA Alumni Testimonial Dinner",
    date: "May 24, 2026",
    day: "24",
    month: "MAY",
    time: "6:00 PM - 9:00 PM",
    location: "PLM College of Accountancy",
    description:
      "An evening of stories, achievements, and meaningful conversations with fellow BSA alumni.",
    category: "Alumni Gathering",
  },
  {
    title: "May 2026 CPALE Passers Recognition",
    date: "May 15, 2026",
    day: "15",
    month: "MAY",
    time: "2:00 PM - 5:00 PM",
    location: "PLM Main Campus",
    description:
      "Celebrating the newest CPA passers and their outstanding achievement in the Accountancy program.",
    category: "Recognition",
  },
  {
    title: "BSA Alumni Homecoming",
    date: "April 18, 2026",
    day: "18",
    month: "APR",
    time: "10:00 AM - 4:00 PM",
    location: "PLM College of Accountancy",
    description:
      "A special gathering where alumni from different batches reconnect and celebrate the PLM BSA community.",
    category: "Homecoming",
  },
];

const upcomingEvents = [
  {
    title: "BSA Alumni General Assembly",
    date: "June 20, 2026",
    day: "20",
    month: "JUN",
  },
  {
    title: "Accountancy Career Talk",
    date: "July 11, 2026",
    day: "11",
    month: "JUL",
  },
  {
    title: "BSA Alumni Sports Day",
    date: "August 15, 2026",
    day: "15",
    month: "AUG",
  },
  {
    title: "BSA Alumni Networking Night",
    date: "September 12, 2026",
    day: "12",
    month: "SEP",
  },
];

export default function Events() {
  return (
    <PublicLayout>
      <main className="bg-white">
        {/* HERO */}
        <section className="relative isolate h-[245px] overflow-hidden sm:h-[270px]">
          <img
            src={plmCampus}
            alt="Pamantasan ng Lungsod ng Maynila campus"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#173a28]/95 via-[#173a28]/65 to-[#173a28]/20" />

          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="font-serif text-sm font-bold uppercase tracking-[0.28em] text-[#e3c55e]">
                PLM BSA ALUMNI
              </p>

              <h1 className="mt-4 font-serif text-6xl font-bold uppercase leading-none tracking-wide text-white sm:text-7xl">
                Events
              </h1>

              <div className="mx-auto mt-5 h-[3px] w-20 bg-[#d4af37]" />

              <p className="mx-auto mt-5 max-w-xl font-serif text-base leading-6 text-white/95 sm:text-lg">
                Stay updated with the latest happenings
                <br />
                in the BSA community.
              </p>
            </div>
          </div>
        </section>

        {/* EVENTS CONTENT */}
        <section className="bg-[#fbfaf5] px-6 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1180px] gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
            {/* EVENT CARDS */}
            <div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event.title}
                    className="group overflow-hidden rounded-xl border border-[#273229] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-[185px] overflow-hidden bg-[#dfe5df]">
                      <img
                        src={eventImage}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 overflow-hidden rounded-lg bg-white text-center shadow-md">
                        <div className="bg-[#18392b] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white">
                          {event.month}
                        </div>
                        <div className="px-3 py-2 font-serif text-2xl font-bold text-[#18392b]">
                          {event.day}
                        </div>
                      </div>

                      <span className="absolute bottom-3 left-3 rounded-full bg-[#d4af37] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#18392b]">
                        {event.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="font-serif text-xl font-bold leading-6 text-[#18392b]">
                        {event.title}
                      </h2>

                      <div className="mt-4 space-y-2 text-xs text-[#68736c]">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} className="shrink-0 text-[#9a7b1d]" />
                          {event.date}
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock size={15} className="shrink-0 text-[#9a7b1d]" />
                          {event.time}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin size={15} className="shrink-0 text-[#9a7b1d]" />
                          {event.location}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#59645c]">
                        {event.description}
                      </p>

                      <button
                        type="button"
                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#315f45] transition hover:text-[#9a7b1d]"
                      >
                        View Details
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* CONTROLS */}
              <div className="mt-8 flex items-center justify-between border-t border-[#d8d8d0] pt-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous events"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b79a3b] bg-white text-[#315f45] transition hover:bg-[#fff2c9]"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next events"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b79a3b] bg-white text-[#315f45] transition hover:bg-[#fff2c9]"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>

                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#b79a3b] bg-white px-5 py-2.5 text-xs font-bold text-[#315f45] transition hover:bg-[#fff2c9]"
                >
                  View All Events
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* UPCOMING EVENTS */}
            <aside className="h-fit rounded-xl border border-[#d8ddd6] bg-[#f7f9f3] p-5 shadow-sm">
              <div className="border-b border-[#d8ddd6] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a7b1d]">
                  Mark Your Calendar
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Upcoming Events
                </h2>
              </div>

              <div className="mt-4 space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="flex gap-3 border-b border-[#dfe3dd] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-fit min-w-[52px] overflow-hidden rounded-md bg-white text-center shadow-sm">
                      <div className="bg-[#18392b] py-1 text-[9px] font-bold tracking-widest text-white">
                        {event.month}
                      </div>
                      <div className="px-2 py-2 font-serif text-xl font-bold text-[#18392b]">
                        {event.day}
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <h3 className="font-serif text-sm font-bold leading-5 text-[#18392b]">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#7a837d]">
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* COMMUNITY STRIP */}
        <section className="bg-[#fbfaf5] px-6 pb-14 pt-4 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-xl border border-[#ddd9c9] bg-white px-6 py-8 text-center shadow-sm sm:flex-row sm:text-left md:px-10 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7b1d]">
                One Community. One Legacy.
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                Continue the PLM BSA story with us.
              </h2>
            </div>

            <Link
              to="/batches"
              className="inline-flex items-center gap-2 rounded-xl border border-[#b79a3b] bg-white px-5 py-3 text-xs font-bold text-[#315f45] transition hover:bg-[#fff2c9]"
            >
              Explore Batches
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#fff2c9]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:grid-cols-[1fr_1px_1fr] lg:px-12">
            <div>
              <div className="flex items-center gap-5">
                <div className="font-black leading-none">
                  <span className="block bg-gradient-to-b from-[#d4af37] to-[#719878] bg-clip-text text-6xl tracking-[-0.08em] text-transparent">
                    BSA
                  </span>
                </div>

                <div className="h-16 w-px bg-[#b79a3b]/60" />

                <div>
                  <p className="font-sans text-3xl font-black leading-none tracking-[-0.04em] text-[#28583e]">
                    ALUMNI
                  </p>
                  <p className="font-sans text-3xl font-black leading-none tracking-[-0.04em] text-[#d4af37]">
                    SYSTEM
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-md font-serif text-sm leading-7 text-[#68736c]">
                Strengthening connections. Honoring our legacy. Building the
                future together.
              </p>
            </div>

            <div className="hidden bg-[#b79a3b]/45 lg:block" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7b1d]">
                Contact Us
              </p>

              <div className="mt-5 space-y-4 text-sm text-[#59645c]">
                <p className="flex gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>
                    General Luna corner Muralla Streets,
                    <br />
                    Intramuros, Manila, 1002 Metro Manila
                  </span>
                </p>

                <p className="flex gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>BSAAlumniSystem.2026@gmail.com</span>
                </p>

                <p className="flex gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-[#315f45]" />
                  <span>(02) 1234-5678 / 09123456789</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#18392b] px-6 py-4 text-center text-xs text-white/75">
            © BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila. All Rights Reserved.
          </div>
        </footer>
      </main>
    </PublicLayout>
  );
}
