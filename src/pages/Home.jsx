import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";

const stats = [
  { value: "500+", label: "Alumni Members", icon: Users },
  { value: "8", label: "BSA Batches", icon: GraduationCap },
  { value: "20+", label: "Achievements", icon: Award },
];

const events = [
  {
    date: "MAY 2026",
    title: "BSA Alumni Testimonial Dinner",
    description:
      "A gathering celebrating the success and professional journey of our BSA alumni.",
  },
  {
    date: "MAY 2026",
    title: "May 2026 CPALE Passers",
    description:
      "Celebrating the achievements of our newest CPA passers and future leaders.",
  },
  {
    date: "APR 2026",
    title: "Alumni Homecoming",
    description:
      "Reconnect with fellow Accountancy graduates and relive memorable moments at PLM.",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      <main>
        <section className="relative overflow-hidden bg-[#18392b]">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d4af37]/20" />
          <div className="absolute -bottom-48 -left-32 h-96 w-96 rounded-full border border-[#d4af37]/10" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-semibold tracking-[0.3em] text-[#d4af37]">
                PLM COLLEGE OF ACCOUNTANCY
              </p>

              <h1 className="font-serif text-6xl font-bold leading-none text-white md:text-8xl">
                BSA
                <span className="block text-[#d4af37]">ALUMNI</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
                A community that connects generations of Bachelor of Science
                in Accountancy graduates, celebrates their achievements, and
                keeps the PLM spirit alive.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/batches"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3.5 font-semibold text-[#18392b] transition hover:bg-[#e5c55b]"
                >
                  Explore Alumni
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/events"
                  className="rounded-lg border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  View Events
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-6">
          <div className="grid overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-xl md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-5 border-b border-gray-100 p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#18392b]/10 text-[#18392b]">
                    <Icon size={23} />
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-[#18392b]">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-[#b28b1e]">
                CELEBRATING EXCELLENCE
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b] md:text-5xl">
                Alumni Spotlight
              </h2>
            </div>

            <p className="max-w-xl text-gray-600">
              Honoring members of our alumni community whose achievements
              continue to inspire the next generation of Accountancy students.
            </p>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-sm md:grid-cols-2">
            <div className="flex min-h-[340px] items-center justify-center bg-[#e9e4d6]">
              <div className="text-center text-[#18392b]/40">
                <GraduationCap className="mx-auto mb-4" size={64} />
                <p className="text-sm font-medium">Alumni Photo</p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-sm font-semibold tracking-widest text-[#b28b1e]">
                ALUMNI SPOTLIGHT
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#18392b]">
                Our Alumni, Our Pride
              </h3>

              <p className="mt-5 leading-7 text-gray-600">
                From successful accounting professionals to leaders across
                different industries, our alumni continue to represent the
                values of excellence, integrity, and service learned at PLM.
              </p>

              <Link
                to="/batches"
                className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-[#18392b] hover:text-[#b28b1e]"
              >
                Meet our alumni
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#eee9dc]">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.25em] text-[#b28b1e]">
                  STAY CONNECTED
                </p>

                <h2 className="mt-2 font-serif text-4xl font-bold text-[#18392b] md:text-5xl">
                  Alumni Events
                </h2>
              </div>

              <Link
                to="/events"
                className="inline-flex items-center gap-2 font-semibold text-[#18392b] hover:text-[#b28b1e]"
              >
                View all events
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event.title}
                  className="rounded-2xl border border-[#d9d2c1] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#b28b1e]">
                    <CalendarDays size={17} />
                    {event.date}
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-bold text-[#18392b]">
                    {event.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {event.description}
                  </p>

                  <Link
                    to="/events"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#18392b]"
                  >
                    Learn more
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#18392b] px-6 py-16 text-center text-white">
          <GraduationCap className="mx-auto text-[#d4af37]" size={38} />

          <h2 className="mt-5 font-serif text-3xl font-bold md:text-4xl">
            Once a PLM Accountancy student,
            <span className="block text-[#d4af37]">
              always part of the family.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Stay connected with your batch, discover upcoming events, and
            celebrate the accomplishments of fellow alumni.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-lg bg-[#d4af37] px-7 py-3.5 font-semibold text-[#18392b] transition hover:bg-[#e5c55b]"
          >
            Access Alumni Portal
          </Link>
        </section>

        <footer className="bg-[#10271e] px-6 py-8 text-center text-sm text-white/50">
          <p>
            © 2026 PLM College of Accountancy — BSA Alumni System
          </p>
        </footer>
      </main>
    </PublicLayout>
  );
}
