import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import plmCampus from "../assets/plm-campus.jpg";

const events = [
  {
    image: "/1.jpg",
    title: "TESTIMONIAL DINNER",
    description:
      "A new horizon beckons, earned through the relentless dedication of our new CPAs.",
  },
  {
    image: "/1.jpg",
    title: "MAY 2026 PASSERS",
    description:
      "PLM achieved a commendable passing rate of 52.94%.",
  },
  {
    image: "/1.jpg",
    title: "MAY 2026 PASSERS",
    description:
      "Celebrating the achievements of our newest CPA passers.",
  },
];

const batches = [
  "2027",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
];

const memories = [
  "/1.jpg",
  "/1.jpg",
  "/1.jpg",
  "/1.jpg",
  "/1.jpg",
];

export default function Home() {
  return (
    <PublicLayout>
      <main className="bg-white text-[#263b30]">

        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-[590px] overflow-hidden sm:min-h-[650px]">

          {/* Campus image */}
          <img
            src={plmCampus}
            alt="Pamantasan ng Lungsod ng Maynila campus"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Green left overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#123d29]/95 via-[#174b32]/82 to-[#174b32]/15" />

          {/* Bottom image darkening */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          {/* Hero content */}
          <div className="relative z-10 mx-auto flex min-h-[590px] w-full max-w-[1250px] items-center px-7 py-16 sm:min-h-[650px] sm:px-10 lg:px-12">

            <div className="max-w-[510px] text-white">

              <p className="font-serif text-sm font-semibold uppercase tracking-[0.08em] text-[#e4c35b] sm:text-base">
                WELCOME BACK,
              </p>

              <h1 className="mt-3 font-sans text-[clamp(4.5rem,10vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.06em]">
                BSA
                <span className="block">ALUMNI</span>
              </h1>

              <div className="my-7 h-[4px] w-[185px] bg-[#e4c35b]" />

              <p className="font-serif text-base leading-6 text-white sm:text-lg sm:leading-7">
                Once part of the journey,
                <br />
                Always part of the legacy.
              </p>

              <p className="mt-6 max-w-[390px] font-serif text-sm leading-6 text-white/90 sm:text-[15px]">
                Reconnect, celebrate achievements, and
                <br className="hidden sm:block" />
                be part of the future of
                <br className="hidden sm:block" />
                <strong className="text-[#e4c35b]">
                  PLM - BSA Community.
                </strong>
              </p>
            </div>

            {/* Statistics */}
            <div className="absolute bottom-8 left-1/2 hidden w-[min(510px,46%)] -translate-x-1/2 rounded-xl border border-white/25 bg-black/35 px-4 py-4 text-white shadow-xl backdrop-blur-md lg:block lg:left-auto lg:right-10 lg:translate-x-0">

              <div className="grid grid-cols-3 divide-x divide-white/40">

                <div className="flex items-center justify-center gap-2 px-3">
                  <Users
                    size={27}
                    strokeWidth={2}
                    className="shrink-0 text-[#e5c448]"
                  />
                  <div>
                    <p className="font-serif text-lg font-bold">
                      3,000+
                    </p>
                    <p className="text-[10px] text-white/80">
                      Alumni
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-3">
                  <GraduationCap
                    size={27}
                    strokeWidth={2}
                    className="shrink-0 text-[#e5c448]"
                  />
                  <div>
                    <p className="font-serif text-lg font-bold">
                      20+
                    </p>
                    <p className="text-[10px] text-white/80">
                      Batches
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-3">
                  <Star
                    size={27}
                    strokeWidth={2}
                    className="shrink-0 text-[#e5c448]"
                  />
                  <div>
                    <p className="font-serif text-lg font-bold">
                      500+
                    </p>
                    <p className="text-[10px] text-white/80">
                      CPA Passers
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WHAT'S HAPPENING
        ========================================================= */}
        <section className="bg-white px-6 py-14 sm:px-8 sm:py-16 lg:px-12">

          <div className="mx-auto grid max-w-[1250px] gap-10 lg:grid-cols-[0.8fr_1.7fr]">

            <div className="flex flex-col justify-center">

              <p className="font-serif text-sm font-bold uppercase tracking-[0.08em] text-[#c39b2d]">
                STAY UPDATED
              </p>

              <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#31563f] sm:text-5xl">
                What's Happening
                <br />
                in BSA?
              </h2>

              <div className="my-6 h-[4px] w-14 bg-[#dfbf50]" />

              <p className="max-w-[350px] font-serif text-sm leading-6 text-[#4f554f]">
                Catch up on the latest events, announcements, and milestones
                happening in our community.
              </p>

              <Link
                to="/events"
                className="mt-6 inline-flex w-fit items-center gap-3 rounded-lg bg-gradient-to-r from-[#e8c458] to-[#76ad78] px-5 py-3 font-serif text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                View All Events
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">

              {events.map((event, index) => (
                <article
                  key={`${event.title}-${index}`}
                  className="overflow-hidden rounded-lg border border-[#40453f] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-[190px] overflow-hidden sm:h-[175px]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif text-sm font-bold text-[#30493b]">
                      {event.title}
                    </h3>

                    <p className="mt-2 font-serif text-xs leading-5 text-[#555a55]">
                      {event.description}
                    </p>
                  </div>
                </article>
              ))}

            </div>
          </div>
        </section>

        {/* =========================================================
            ALUMNI SPOTLIGHT
        ========================================================= */}
        <section className="px-6 pb-14 sm:px-8 lg:px-12">

          <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-lg bg-gradient-to-r from-[#1b321f] to-[#285b3d] text-white shadow-md md:grid-cols-[0.9fr_0.75fr_1.2fr]">

            <div className="flex flex-col justify-center p-7 sm:p-9">

              <p className="font-serif text-sm font-bold uppercase tracking-[0.08em] text-[#e4c35b]">
                ALUMNI SPOTLIGHT
              </p>

              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                <span className="text-[#e4c35b]">“</span>
                Just keep
                <br />
                going
                <span className="text-[#e4c35b]">”</span>
              </h2>

              <p className="mt-5 max-w-[240px] font-serif text-xs leading-5 text-white/85">
                Inspiring stories of our alumni who continue to make an
                impact.
              </p>
            </div>

            <div className="min-h-[230px] bg-black/10">

              <img
                src="/1.jpg"
                alt="Featured BSA alumnus"
                className="h-full min-h-[230px] w-full object-cover"
              />

            </div>

            <div className="flex flex-col justify-center p-7 sm:p-9">

              <h3 className="font-serif text-2xl font-semibold">
                Dante F. Falsado, CPA, CMA
              </h3>

              <p className="mt-1 font-serif text-sm text-white/80">
                Professor at Pamantasan ng Lungsod ng Maynila
              </p>

              <p className="mt-5 max-w-[410px] font-serif text-sm italic leading-6 text-white/90">
                “The values and the discipline I learned in BSA shaped the
                professional I am today.”
              </p>

              <button
                type="button"
                className="mt-6 w-fit self-end rounded-lg border border-white/70 px-6 py-2 font-serif text-xs font-semibold transition hover:bg-white hover:text-[#234a34]"
              >
                Read Their Stories
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================
            EXPLORE BY BATCH + MEMORY LANE
        ========================================================= */}
        <section className="bg-white px-6 pb-16 sm:px-8 lg:px-12">

          <div className="mx-auto grid max-w-[1250px] gap-8 lg:grid-cols-[0.95fr_1.25fr]">

            {/* Batch */}
            <div className="rounded-lg bg-[#f8fbf8] p-6 sm:p-7">

              <div className="mb-5 flex items-center gap-3">
                <Users
                  size={24}
                  className="text-[#315b43]"
                />

                <h2 className="font-serif text-xl font-bold text-[#315b43]">
                  EXPLORE BY BATCH
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-3">

                {batches.map((batch) => (
                  <Link
                    key={batch}
                    to="/batches"
                    className="flex min-h-[45px] items-center justify-center rounded-lg bg-[#e6c66c] px-2 py-2 font-serif text-sm font-semibold text-white shadow-sm transition hover:bg-[#d5ae45] hover:-translate-y-0.5"
                  >
                    {batch}
                  </Link>
                ))}

                <Link
                  to="/batches"
                  className="flex min-h-[45px] items-center justify-center rounded-lg bg-[#e6c66c] px-2 py-2 font-serif text-sm font-semibold text-white shadow-sm transition hover:bg-[#d5ae45] hover:-translate-y-0.5"
                >
                  More
                </Link>

              </div>
            </div>

            {/* Memory Lane */}
            <div className="border-l border-[#d9d5ca] pl-0 lg:pl-8">

              <div className="mb-5 flex items-center gap-3">
                <CalendarDays
                  size={23}
                  className="text-[#315b43]"
                />

                <h2 className="font-serif text-xl font-bold text-[#315b43]">
                  MEMORY LANE
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2">

                {memories.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden rounded-lg ${
                      index === 0
                        ? "row-span-2"
                        : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`BSA memory ${index + 1}`}
                      className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${
                        index === 0
                          ? "min-h-[210px]"
                          : "min-h-[100px]"
                      }`}
                    />
                  </div>
                ))}

              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <footer>

          <div className="bg-[#fff3d1] px-6 py-12 sm:px-8 lg:px-12">

            <div className="mx-auto grid max-w-[1250px] gap-10 md:grid-cols-[1.1fr_1fr]">

              <div className="flex items-center justify-center md:justify-start">

                <div className="font-sans font-black leading-none">
                  <span className="text-[70px] tracking-[-0.08em] text-[#d4b341] sm:text-[82px]">
                    BSA
                  </span>

                  <span className="mx-3 text-5xl font-light text-[#b7a66a]">
                    |
                  </span>

                  <span className="inline-block align-middle text-[30px] text-[#31563f] sm:text-[35px]">
                    ALUMNI
                    <br />
                    <span className="text-[#d4b341]">
                      SYSTEM
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-l border-[#cfc5a9] pl-0 md:pl-8">

                <h3 className="font-serif text-xl font-bold text-[#31563f]">
                  CONTACT US
                </h3>

                <div className="mt-5 space-y-4">

                  <div className="flex gap-3">
                    <MapPin
                      size={19}
                      className="mt-0.5 shrink-0 text-[#18392b]"
                    />

                    <p className="font-serif text-xs leading-5 text-[#4d504b]">
                      General Luna corner Muralla Streets,
                      <br />
                      Intramuros, Manila, 1002 Metro Manila,
                      Philippines
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail
                      size={19}
                      className="shrink-0 text-[#18392b]"
                    />

                    <p className="font-serif text-xs text-[#4d504b]">
                      BSAAlumniSystem.2026@gmail.com
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone
                      size={19}
                      className="shrink-0 text-[#18392b]"
                    />

                    <p className="font-serif text-xs text-[#4d504b]">
                      (02) 1234-5678 / 09123456789
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#183521] px-6 py-4 text-center">

            <p className="font-serif text-xs text-white/90 sm:text-sm">
              © BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila.
              &nbsp; All Rights Reserved
            </p>

          </div>
        </footer>

      </main>
    </PublicLayout>
  );
}
