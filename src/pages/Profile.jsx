import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  BriefcaseBusiness,
  GraduationCap,
  Pencil,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f7f5ee]">
      <DashboardSidebar />

      <main className="min-h-screen lg:pl-72">
        <header className="border-b border-[#ddd7c8] bg-white px-6 py-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                Alumni Portal
              </p>
              <h1 className="font-serif text-2xl font-bold text-[#18392b]">
                My Profile
              </h1>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#18392b] hover:underline"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <section className="overflow-hidden rounded-2xl border border-[#ddd7c8] bg-white shadow-sm">
            <div className="h-36 bg-[#18392b]" />

            <div className="px-6 pb-7 lg:px-8">
              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#eee9dc] text-[#18392b] shadow-sm">
                    <GraduationCap size={40} />
                  </div>

                  <div className="pb-1">
                    <h2 className="font-serif text-2xl font-bold text-[#18392b]">
                      Maria Santos
                    </h2>
                    <p className="text-sm text-gray-500">
                      BSA Batch 2025
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24513d]">
                  <Pencil size={17} />
                  Edit Profile
                </button>
              </div>

              <div className="mt-8 grid gap-5 border-t border-gray-100 pt-7 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 text-[#18392b]" size={19} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      maria.santos@example.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 text-[#18392b]" size={19} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      +63 917 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-[#18392b]" size={19} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Address
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Manila, Philippines
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="mt-0.5 text-[#18392b]" size={19} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Profession
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Certified Public Accountant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
              Academic Information
            </p>

            <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
              Education
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Program
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  Bachelor of Science in Accountancy
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Graduation Year
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  2025
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Student Number
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  2021-12345
                </p>
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#ddd7c8] bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
              About Me
            </p>

            <h3 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
              Biography
            </h3>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600">
              A proud graduate of the PLM College of Accountancy. Currently
              working as a Certified Public Accountant and actively staying
              connected with the BSA alumni community.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
