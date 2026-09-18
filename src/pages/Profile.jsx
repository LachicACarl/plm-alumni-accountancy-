import plmCampus from "../assets/plm-campus.jpg";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  BriefcaseBusiness,
  GraduationCap,
  Pencil,
  Award,
  CalendarDays,
  UserRound,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <DashboardSidebar />

      <main className="min-h-screen lg:pl-72">
        {/* Header */}
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b806b]">
                Alumni Portal
              </p>

              <h1 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                My Profile
              </h1>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#ddd7c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#18392b] transition hover:bg-[#eee9dc]"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          {/* Profile Hero */}
          <section className="overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm">
            <div className="relative h-44 overflow-hidden bg-[#18392b]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${plmCampus})` }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#18392b] via-[#18392b]/90 to-[#18392b]/60" />

              <div className="absolute bottom-6 left-7">
                <p className="text-xs font-semibold tracking-[0.25em] text-[#d4af37]">
                  PLM COLLEGE OF ACCOUNTANCY
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Bachelor of Science in Accountancy Alumni
                </p>
              </div>
            </div>

            <div className="px-6 pb-8 lg:px-9">
              <div className="-mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#eee9dc] text-[#18392b] shadow-lg">
                    <GraduationCap size={48} />
                  </div>

                  <div className="pb-1">
                    <span className="inline-flex rounded-full bg-[#eee9dc] px-3 py-1 text-xs font-bold text-[#8d6d12]">
                      BSA Batch 2025
                    </span>

                    <h2 className="mt-2 font-serif text-3xl font-bold text-[#18392b]">
                      Maria Santos
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Certified Public Accountant
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] transition hover:-translate-y-0.5"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              </div>

              {/* Contact Information */}
              <div className="mt-9 grid gap-4 border-t border-[#eee9dc] pt-8 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#faf9f5] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <Mail size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Email Address
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-[#18392b]">
                        maria.santos@example.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <Phone size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Phone Number
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#18392b]">
                        +63 917 123 4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#18392b]">
                        Manila, Philippines
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                      <BriefcaseBusiness size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Profession
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#18392b]">
                        Certified Public Accountant
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className="mt-7 rounded-3xl border border-[#ddd7c8] bg-white p-7 shadow-sm lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#18392b] text-white">
                <GraduationCap size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Academic Information
                </p>

                <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Education
                </h3>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Program
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-[#18392b]">
                  Bachelor of Science in Accountancy
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Graduation Year
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <CalendarDays size={17} className="text-[#b28b1e]" />
                  <p className="text-sm font-semibold text-[#18392b]">
                    2025
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Student Number
                </p>

                <p className="mt-2 text-sm font-semibold text-[#18392b]">
                  2021-12345
                </p>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="mt-7 rounded-3xl border border-[#ddd7c8] bg-white p-7 shadow-sm lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                <BriefcaseBusiness size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Career Information
                </p>

                <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Professional Profile
                </h3>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-[#faf9f5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Profession
                </p>

                <p className="mt-2 text-sm font-semibold text-[#18392b]">
                  Certified Public Accountant
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf9f5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Organization
                </p>

                <p className="mt-2 text-sm font-semibold text-[#18392b]">
                  Accounting Professional
                </p>
              </div>
            </div>
          </section>

          {/* Biography */}
          <section className="mt-7 rounded-3xl border border-[#ddd7c8] bg-white p-7 shadow-sm lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eee9dc] text-[#18392b]">
                <UserRound size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b28b1e]">
                  About Me
                </p>

                <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                  Biography
                </h3>
              </div>
            </div>

            <p className="mt-7 max-w-4xl rounded-2xl bg-[#faf9f5] p-6 text-sm leading-7 text-gray-600">
              A proud graduate of the PLM College of Accountancy. Currently
              working as a Certified Public Accountant and actively staying
              connected with the BSA alumni community.
            </p>
          </section>

          {/* Profile Status */}
          <section className="mt-7 overflow-hidden rounded-3xl bg-[#18392b] p-7 text-white shadow-sm lg:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
                  <Award size={24} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                    Alumni Profile
                  </p>

                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Keep your information updated
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                    Updated profile information helps the BSA alumni community
                    stay connected and keeps your alumni record accurate.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee]"
              >
                <Pencil size={17} />
                Update Profile
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
