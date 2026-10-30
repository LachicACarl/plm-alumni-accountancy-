import { useEffect, useState } from "react";
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
  X,
  Save,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Your alumni session could not be found.");
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "first_name, middle_name, last_name, email, phone, address, student_number, graduation_year, profession, company, bio, role"
        )
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const loadedProfile = {
        ...data,
        email: data.email || user.email || "",
      };

      setProfile(loadedProfile);
      setForm(loadedProfile);
    } catch (loadError) {
      console.error("Unable to load alumni profile:", loadError);
      setError(loadError.message || "Unable to load your alumni profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openEdit() {
    setForm({ ...profile });
    setSuccess("");
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setForm({ ...profile });
    setError("");
    setEditing(false);
  }

  async function saveProfile(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Your alumni session could not be found.");
      }

      const updates = {
        first_name: form.first_name?.trim() || null,
        middle_name: form.middle_name?.trim() || null,
        last_name: form.last_name?.trim() || null,
        phone: form.phone?.trim() || null,
        address: form.address?.trim() || null,
        profession: form.profession?.trim() || null,
        company: form.company?.trim() || null,
        bio: form.bio?.trim() || null,
      };

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select(
          "first_name, middle_name, last_name, email, phone, address, student_number, graduation_year, profession, company, bio, role"
        )
        .single();

      if (updateError) throw updateError;

      setProfile({
        ...data,
        email: data.email || user.email || "",
      });

      setForm({
        ...data,
        email: data.email || user.email || "",
      });

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (saveError) {
      console.error("Unable to update alumni profile:", saveError);
      setError(saveError.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  const fullName = profile
    ? [profile.first_name, profile.middle_name, profile.last_name]
        .filter(Boolean)
        .join(" ")
    : "Alumni";

  const graduationYear = profile?.graduation_year || "Not provided";
  const profession = profile?.profession || "Not provided";
  const company = profile?.company || "Not provided";
  const studentNumber = profile?.student_number || "Not provided";
  const email = profile?.email || "Not provided";
  const phone = profile?.phone || "Not provided";
  const address = profile?.address || "Not provided";
  const bio = profile?.bio || "No biography has been added yet.";

  const contactItems = [
    {
      label: "Email Address",
      value: email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: phone,
      icon: Phone,
    },
    {
      label: "Location",
      value: address,
      icon: MapPin,
    },
    {
      label: "Profession",
      value: profession,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#ddd7c8] bg-white px-5 py-4 sm:px-6 lg:px-8">
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

        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {success}
            </div>
          )}

          {loading && (
            <div className="rounded-3xl border border-[#ddd7c8] bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#18392b]">
                Loading your alumni profile...
              </p>
            </div>
          )}

          {!loading && error && !editing && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && profile && editing && form && (
            <section className="rounded-3xl border border-[#ddd7c8] bg-white shadow-sm">
              <div className="border-b border-[#eee9dc] px-6 py-5 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b28b1e]">
                      Profile Settings
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-bold text-[#18392b]">
                      Edit Profile
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal and professional information.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ddd7c8] text-[#18392b] transition hover:bg-[#f7f5ee]"
                    aria-label="Close edit profile"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={saveProfile} className="p-6 lg:p-8">
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      value={form.first_name || ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Middle Name
                    </label>
                    <input
                      name="middle_name"
                      value={form.middle_name || ""}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={form.last_name || ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Email Address
                    </label>
                    <input
                      value={form.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-[#ddd7c8] bg-[#f7f5ee] px-4 py-3 text-sm text-gray-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">
                      Email is managed through your account authentication.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Student Number
                    </label>
                    <input
                      value={form.student_number || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-[#ddd7c8] bg-[#f7f5ee] px-4 py-3 text-sm text-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Address
                    </label>
                    <input
                      name="address"
                      value={form.address || ""}
                      onChange={handleChange}
                      placeholder="Your current address"
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Profession
                    </label>
                    <input
                      name="profession"
                      value={form.profession || ""}
                      onChange={handleChange}
                      placeholder="e.g. Accountant"
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                      Organization
                    </label>
                    <input
                      name="company"
                      value={form.company || ""}
                      onChange={handleChange}
                      placeholder="Company or organization"
                      className="w-full rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#8b806b]">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio || ""}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell the alumni community a little about yourself."
                    className="w-full resize-y rounded-xl border border-[#ddd7c8] bg-white px-4 py-3 text-sm leading-6 text-[#18392b] outline-none transition focus:border-[#b28b1e] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#eee9dc] pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ddd7c8] bg-white px-5 py-3 text-sm font-bold text-[#18392b] transition hover:bg-[#f7f5ee] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-3 text-sm font-bold text-[#18392b] shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {!loading && !error && profile && !editing && (
            <>
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
                          {profile.graduation_year
                            ? `BSA Batch ${profile.graduation_year}`
                            : "BSA Alumni"}
                        </span>

                        <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#18392b]">
                          {fullName}
                        </h2>

                        <p className="mt-0.5 text-sm text-[#6b716c]">
                          {profession}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openEdit}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b28b1e] px-5 py-2.5 text-sm font-bold text-[#18392b] shadow-sm transition hover:-translate-y-0.5"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  </div>

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
                      <p className="text-sm font-semibold text-[#18392b]">
                        {graduationYear}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918b7c]">
                      Student Number
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-[#18392b]">
                      {studentNumber}
                    </p>
                  </div>
                </div>
              </section>

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
                          {profession}
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
                          {company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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

                <p className="mt-5 rounded-2xl border border-[#eee9dc] bg-[#faf9f5] p-5 text-sm leading-7 text-gray-600">
                  {bio}
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
