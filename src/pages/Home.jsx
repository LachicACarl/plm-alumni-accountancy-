import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, GraduationCap, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import plmCampus from "../assets/plm-campus.jpg";
import eventImage from "../assets/1.jpg";
import { supabase } from "../lib/supabase";

const defaults = {
  hero: { eyebrow: "WELCOME BACK,", title: "BSA ALUMNI", tagline: "Once part of the journey, Always part of the legacy.", description: "Reconnect, celebrate achievements, and be part of the future of PLM - BSA Community.", campusImage: "" },
  statistics: [{ value: "3,000+", label: "Alumni" }, { value: "20+", label: "Batches" }, { value: "500+", label: "CPA Passers" }],
  events: { eyebrow: "STAY UPDATED", title: "What's Happening in BSA?", description: "Catch up on the latest events, announcements, and milestones happening in our community.", items: [{ title: "TESTIMONIAL DINNER", description: "A new horizon beckons, earned through the relentless dedication of our new CPAs.", image: "" }, { title: "MAY 2026 PASSERS", description: "PLM achieved a commendable passing rate of 52.94%.", image: "" }, { title: "MAY 2026 PASSERS", description: "Celebrating the achievements of our newest CPA passers.", image: "" }] },
  spotlight: { eyebrow: "ALUMNI SPOTLIGHT", quoteTitle: "Just keep going", description: "Inspiring stories of our alumni who continue to make an impact.", name: "Dante F. Falsado, CPA, CMA", position: "Professor at Pamantasan ng Lungsod ng Maynila", quote: "The values and the discipline I learned in BSA shaped the professional I am today.", image: "" },
  batches: ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"],
  memories: ["", "", "", "", ""],
  footer: { address: "General Luna corner Muralla Streets, Intramuros, Manila, 1002 Metro Manila, Philippines", email: "BSAAlumniSystem.2026@gmail.com", phone: "(02) 1234-5678 / 09123456789", copyright: "© BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila. All Rights Reserved" },
};
const safeImage = (url, fallback) => typeof url === "string" && /^https:\/\//i.test(url) ? url : fallback;
const safeText = (value, fallback = "") => typeof value === "string" ? value : fallback;

export default function Home() {
  const [content, setContent] = useState(defaults);
  useEffect(() => {
    let active = true;
    supabase.from("homepage_content").select("content").eq("id", "main").maybeSingle()
      .then(({ data, error }) => {
        if (!active || error || !data?.content) return;
        const saved = data.content;
        setContent({
          ...defaults, ...saved,
          hero: { ...defaults.hero, ...saved.hero },
          events: { ...defaults.events, ...saved.events, items: Array.isArray(saved.events?.items) ? saved.events.items : defaults.events.items },
          spotlight: { ...defaults.spotlight, ...saved.spotlight },
          footer: { ...defaults.footer, ...saved.footer },
          statistics: Array.isArray(saved.statistics) ? saved.statistics.slice(0, 3) : defaults.statistics,
          batches: Array.isArray(saved.batches) ? saved.batches : defaults.batches,
          memories: Array.isArray(saved.memories) ? saved.memories.slice(0, 5) : defaults.memories,
        });
      }).catch(() => {});
    return () => { active = false; };
  }, []);

  const { hero, events, spotlight, footer } = content;
  const titleParts = safeText(hero.title, defaults.hero.title).split(" ");
  const campusImage = safeImage(hero.campusImage, plmCampus);

  return (
    <PublicLayout>
      <main className="bg-white text-[#263b30]">
        <section className="relative min-h-[590px] overflow-hidden sm:min-h-[650px]">
          <img src={campusImage} alt="Pamantasan ng Lungsod ng Maynila campus" className="absolute inset-0 h-full w-full object-cover object-center"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#123d29]/95 via-[#174b32]/82 to-[#174b32]/15"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"/>
          <div className="relative z-10 mx-auto flex min-h-[590px] w-full max-w-[1250px] items-center px-7 py-16 sm:min-h-[650px] sm:px-10 lg:px-12">
            <div className="max-w-[510px] text-white">
              <p className="font-serif text-sm font-semibold uppercase tracking-[0.08em] text-[#e4c35b] sm:text-base">{safeText(hero.eyebrow, defaults.hero.eyebrow)}</p>
              <h1 className="mt-3 font-sans text-[clamp(4.5rem,10vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.06em]">{titleParts.map((part, index) => <span className="block" key={index}>{part}</span>)}</h1>
              <div className="my-7 h-[4px] w-[185px] bg-[#e4c35b]"/>
              <p className="font-serif text-base leading-6 text-white sm:text-lg sm:leading-7">{safeText(hero.tagline, defaults.hero.tagline)}</p>
              <p className="mt-6 max-w-[390px] font-serif text-sm leading-6 text-white/90 sm:text-[15px]">{safeText(hero.description, defaults.hero.description)}</p>
            </div>
            <div className="absolute bottom-8 left-1/2 hidden w-[min(510px,46%)] -translate-x-1/2 rounded-xl border border-white/25 bg-black/35 px-4 py-4 text-white shadow-xl backdrop-blur-md lg:block lg:left-auto lg:right-10 lg:translate-x-0">
              <div className="grid grid-cols-3 divide-x divide-white/40">
                {content.statistics.map((stat, index) => { const Icon = [Users, GraduationCap, Star][index] || Star; return <div key={stat.label || index} className="flex items-center justify-center gap-2 px-3"><Icon size={27} className="shrink-0 text-[#e5c448]"/><div><p className="font-serif text-lg font-bold">{safeText(stat.value)}</p><p className="text-[10px] text-white/80">{safeText(stat.label)}</p></div></div>; })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto grid max-w-[1250px] gap-10 lg:grid-cols-[0.8fr_1.7fr]">
            <div className="flex flex-col justify-center">
              <p className="font-serif text-sm font-bold uppercase tracking-[0.08em] text-[#c39b2d]">{safeText(events.eyebrow, defaults.events.eyebrow)}</p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#31563f] sm:text-5xl">{safeText(events.title, defaults.events.title)}</h2>
              <div className="my-6 h-[4px] w-14 bg-[#dfbf50]"/>
              <p className="max-w-[350px] font-serif text-sm leading-6 text-[#4f554f]">{safeText(events.description, defaults.events.description)}</p>
              <Link to="/events" className="mt-6 inline-flex w-fit items-center gap-3 rounded-lg bg-gradient-to-r from-[#e8c458] to-[#76ad78] px-5 py-3 font-serif text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">View All Events <ArrowRight size={17}/></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {events.items.map((event, index) => <article key={index} className="overflow-hidden rounded-lg border border-[#40453f] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="h-[190px] overflow-hidden sm:h-[175px]"><img src={safeImage(event.image, eventImage)} alt={safeText(event.title, "BSA event")} className="h-full w-full object-cover transition duration-500 hover:scale-105"/></div><div className="p-4"><h3 className="font-serif text-sm font-bold text-[#30493b]">{safeText(event.title)}</h3><p className="mt-2 font-serif text-xs leading-5 text-[#555a55]">{safeText(event.description)}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="px-6 pb-14 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-lg bg-gradient-to-r from-[#1b321f] to-[#285b3d] text-white shadow-md md:grid-cols-[0.9fr_0.75fr_1.2fr]">
            <div className="flex flex-col justify-center p-7 sm:p-9"><p className="font-serif text-sm font-bold uppercase tracking-[0.08em] text-[#e4c35b]">{safeText(spotlight.eyebrow, defaults.spotlight.eyebrow)}</p><h2 className="mt-5 font-serif text-3xl font-bold leading-tight sm:text-4xl"><span className="text-[#e4c35b]">“</span>{safeText(spotlight.quoteTitle, defaults.spotlight.quoteTitle)}<span className="text-[#e4c35b]">”</span></h2><p className="mt-5 max-w-[240px] font-serif text-xs leading-5 text-white/85">{safeText(spotlight.description, defaults.spotlight.description)}</p></div>
            <div className="min-h-[230px] bg-black/10"><img src={safeImage(spotlight.image, eventImage)} alt={safeText(spotlight.name, "Featured BSA alumnus")} className="h-full min-h-[230px] w-full object-cover"/></div>
            <div className="flex flex-col justify-center p-7 sm:p-9"><h3 className="font-serif text-2xl font-semibold">{safeText(spotlight.name)}</h3><p className="mt-1 font-serif text-sm text-white/80">{safeText(spotlight.position)}</p><p className="mt-5 max-w-[410px] font-serif text-sm italic leading-6 text-white/90">“{safeText(spotlight.quote)}”</p></div>
          </div>
        </section>

        <section className="bg-white px-6 pb-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1250px] gap-8 lg:grid-cols-[0.95fr_1.25fr]">
            <div className="rounded-lg bg-[#f8fbf8] p-6 sm:p-7"><div className="mb-5 flex items-center gap-3"><Users size={24} className="text-[#315b43}"/><h2 className="font-serif text-xl font-bold text-[#315b43]">EXPLORE BY BATCH</h2></div><div className="grid grid-cols-4 gap-3">{content.batches.map((batch) => <Link key={batch} to="/batches" className="flex min-h-[45px] items-center justify-center rounded-lg bg-[#e6c66c] px-2 py-2 font-serif text-sm font-semibold text-white shadow-sm transition hover:bg-[#d5ae45] hover:-translate-y-0.5">{batch}</Link>)}<Link to="/batches" className="flex min-h-[45px] items-center justify-center rounded-lg bg-[#e6c66c] px-2 py-2 font-serif text-sm font-semibold text-white shadow-sm transition hover:bg-[#d5ae45] hover:-translate-y-0.5">More</Link></div></div>
            <div className="border-l border-[#d9d5ca] pl-0 lg:pl-8"><div className="mb-5 flex items-center gap-3"><CalendarDays size={23} className="text-[#315b43}"/><h2 className="font-serif text-xl font-bold text-[#315b43]">MEMORY LANE</h2></div><div className="grid grid-cols-3 gap-2">{content.memories.map((image, index) => <div key={index} className={`overflow-hidden rounded-lg ${index === 0 ? "row-span-2" : ""}`}><img src={safeImage(image, eventImage)} alt={`BSA memory ${index + 1}`} className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${index === 0 ? "min-h-[210px]" : "min-h-[100px]"}`}/></div>)}</div></div>
          </div>
        </section>

        <footer>
          <div className="bg-[#fff3d1] px-6 py-12 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1250px] gap-10 md:grid-cols-[1.1fr_1fr]"><div className="flex items-center justify-center md:justify-start"><div className="font-sans font-black leading-none"><span className="text-[70px] tracking-[-0.08em] text-[#d4b341] sm:text-[82px]">BSA</span><span className="mx-3 text-5xl font-light text-[#b7a66a]">|</span><span className="inline-block align-middle text-[30px] text-[#31563f] sm:text-[35px]">ALUMNI<br/><span className="text-[#d4b341]">SYSTEM</span></span></div></div>
            <div className="border-l border-[#cfc5a9] pl-0 md:pl-8"><h3 className="font-serif text-xl font-bold text-[#31563f]">CONTACT US</h3><div className="mt-5 space-y-4"><div className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-[#18392b]"/><p className="font-serif text-xs leading-5 text-[#4d504b]">{safeText(footer.address)}</p></div><div className="flex items-center gap-3"><Mail size={19} className="shrink-0 text-[#18392b]"/><p className="font-serif text-xs text-[#4d504b]">{safeText(footer.email)}</p></div><div className="flex items-center gap-3"><Phone size={19} className="shrink-0 text-[#18392b]"/><p className="font-serif text-xs text-[#4d504b]">{safeText(footer.phone)}</p></div></div></div></div></div>
          <div className="bg-[#183521] px-6 py-4 text-center"><p className="font-serif text-xs text-white/90 sm:text-sm">{safeText(footer.copyright)}</p></div>
        </footer>
      </main>
    </PublicLayout>
  );
}
