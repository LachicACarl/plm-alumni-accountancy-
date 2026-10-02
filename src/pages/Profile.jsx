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
  CalendarDays,
  UserRound,
  Building2,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

const contactItems = [
  {
    label: "Email Address",
    value: "maria.santos@example.com",
    icon: Mail,
  },
  {
    label: "Phone Number",
    value: "+63 917 123 4567",
    icon: Phone,
  },
  {
    label: "Location",
    value: "Manila, Philippines",
    icon: MapPin,
  },
  {
    label: "Profession",
    value: "Certified Public Accountant",
    icon: BriefcaseBusiness,
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f7f5ee] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-4 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8b806b]">
                Alumni Portal
              </p>
              <h1 className="mt-0.5 font-serif text-2xl font-bold text-[#18392b]">
                My Profile
              </h1>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#ddd7c8] bg-white px-4 py-2 text-sm font-semibold text-[#18392b] transition hover:bg-[#f7f5ee]"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8 lg:py-8">

          {/* Profile Header */}
          <section className="overflow-hidden rounded-3xl border border-[#ddd7c8] bg-white shadow-sm">
            <div className="relative h-40 overflow-hidden bg-[#18392b]">
              <img
                src={plmCampus}
                alt="PLM Campus"
                className="absolute inset-0 h-full w-full object-cover opacity-35"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#18392b] via-[#18392b]/85 to-[#18392b]/45" />

              <div className="relative flex h-full items-end px-6 pb-6 lg:px-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
                    PLM College of Accountancy
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    BSA Alumni System
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 lg:px-8">
              <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#eee9dc] text-[#18392b] shadow-md">
                    <UserRound size={38} />
                  </div>

                  <div className="pb-1">
                    <span className="inline-flex rounded-full bg-[#eee9dc] px-3 py-1 text-[11px] font-bold text-[#8d6d12]">
                      BSA Batch 2025
                    </span>

                    <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#18392b]">
                      Maria Santos
                    </h2>

                    <p className="mt-0.5 text-sm text-[#6b716c]">
                      Certified Public Accountant
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-2.5 text-sm font-bold text-[#18392b] shadow-sm transition hover:-translate-y-0.5"
                >
                  <Pencil size={16} />
                  Edit Profile
                </Link>
              </div>

              {/* Contact Details */}
              <div className="mt-7 grid gap-3 border-t border-[#eee9dc] pt-6 sm:grid-cols-2 lg:grid-cols-4">
                {contactItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8eee9] text-[#18392b]">
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                          {label}
                        </p>
                        <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#18392b]">
                          {value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className="mt-5 rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm lg:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392b] text-white">
                <GraduationCap size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Academic Information
                </p>
                <h3 className="font-serif text-xl font-bold text-[#18392b]">
                  Education
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                  Program
                </p>
                <p className="mt-1.5 text-sm font-semibold leading-5 text-[#18392b]">
                  Bachelor of Science in Accountancy
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                  Graduation Year
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#b28b1e]" />
                  <p className="text-sm font-semibold text-[#18392b]">2025</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                  Student Number
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#18392b]">
                  2021-12345
                </p>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="mt-5 rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm lg:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8eee9] text-[#18392b]">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                  Career Information
                </p>
                <h3 className="font-serif text-xl font-bold text-[#18392b]">
                  Professional Profile
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness size={17} className="text-[#b28b1e]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                      Profession
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#18392b]">
                      Certified Public Accountant
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                <div className="flex items-center gap-3">
                  <Building2 size={17} className="text-[#b28b1e]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                      Organization
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#18392b]">
                      Accounting Professional
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Biography */}
          <section className="mt-5 rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm lg:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8eee9] text-[#18392b]">
                <UserRound size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                  About Me
                </p>
                <h3 className="font-serif text-xl font-bold text-[#18392b]">
                  Biography
                </h3>
              </div>
            </div>

            <p className="mt-5 rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-5 text-sm leading-6 text-[#606862]">
              A proud graduate of the PLM College of Accountancy. Currently
              working as a Certified Public Accountant and actively staying
              connected with the BSA alumni community.
            </p>
          </section>

          {/* Update Profile */}
          <section className="mt-5 overflow-hidden rounded-3xl bg-[#18392b] p-6 text-white shadow-sm lg:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]">
                  <Pencil size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                    Alumni Profile
                  </p>
                  <h3 className="mt-0.5 font-serif text-xl font-bold">
                    Keep your information updated
                  </h3>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-white/65">
                    Updated information helps keep your alumni record accurate
                    and makes it easier for the BSA community to stay connected.
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/profile"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee]"
              >
                <Pencil size={16} />
                Update Profile
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
