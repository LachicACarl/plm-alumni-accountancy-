import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";

const events = [
  {
    title: "BSA Alumni Testimonial Dinner",
    date: "May 24, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "PLM College of Accountancy",
    description:
      "An evening of stories, achievements, and meaningful conversations with fellow BSA alumni.",
    category: "Alumni Gathering",
  },
  {
    title: "May 2026 CPALE Passers Recognition",
    date: "May 15, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "PLM Main Campus",
    description:
      "Celebrating the newest CPA passers and their outstanding achievement in the Accountancy program.",
    category: "Recognition",
  },
  {
    title: "BSA Alumni Homecoming",
    date: "April 18, 2026",
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
  },
  {
    title: "Accountancy Career Talk",
    date: "July 11, 2026",
  },
  {
    title: "BSA Alumni Sports Day",
    date: "August 15, 2026",
  },
];

export default function Events() {
  return (
    <PublicLayout>
      <main>
        <section className="bg-[#18392b] px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
              PLM BSA ALUMNI
            </p>

            <h1 className="mt-3 font-serif text-6xl font-bold md:text-7xl">
              EVENTS
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Stay connected with the PLM College of Accountancy alumni
              community through gatherings, recognitions, and activities.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-8">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#b28b1e]">
                  ALUMNI ACTIVITIES
                </p>

                <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b]">
                  Recent Events
                </h2>
              </div>

              <div className="space-y-6">
                {events.map((event) => (
                  <article
                    key={event.title}
                    className="overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="grid md:grid-cols-[180px_1fr]">
                      <div className="flex min-h-40 flex-col justify-center bg-[#eee9dc] p-6 text-center">
                        <CalendarDays
                          size={30}
                          className="mx-auto text-[#18392b]"
                        />

                        <p className="mt-4 text-sm font-bold text-[#18392b]">
                          {event.date}
                        </p>

                        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#b28b1e]">
                          {event.category}
                        </span>
                      </div>

                      <div className="p-7">
                        <h3 className="font-serif text-2xl font-bold text-[#18392b]">
                          {event.title}
                        </h3>

                        <p className="mt-3 leading-7 text-gray-600">
                          {event.description}
                        </p>

                        <div className="mt-5 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:gap-6">
                          <span className="flex items-center gap-2">
                            <Clock size={16} className="text-[#b28b1e]" />
                            {event.time}
                          </span>

                          <span className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#b28b1e]" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside>
              <div className="rounded-2xl bg-[#18392b] p-7 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
                  <CalendarDays size={23} />
                </div>

                <h2 className="mt-6 font-serif text-2xl font-bold">
                  Upcoming Events
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Mark your calendar and stay involved with the alumni
                  community.
                </p>

                <div className="mt-6 space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.title}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm font-semibold text-[#d4af37]">
                        {event.date}
                      </p>

                      <p className="mt-1 font-medium text-white">
                        {event.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
                <Users size={28} className="text-[#18392b]" />

                <h3 className="mt-4 font-serif text-xl font-bold text-[#18392b]">
                  Join the Community
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Register as an alumnus to receive updates about upcoming
                  events and activities.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
