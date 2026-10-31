import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Save, RotateCcw } from "lucide-react";
import { supabase } from "../lib/supabase";

const defaultContent = {
  hero: { eyebrow: "WELCOME BACK,", title: "BSA ALUMNI", tagline: "Once part of the journey, Always part of the legacy.", description: "Reconnect, celebrate achievements, and be part of the future of PLM - BSA Community.", campusImage: "" },
  statistics: [{ value: "3,000+", label: "Alumni" }, { value: "20+", label: "Batches" }, { value: "500+", label: "CPA Passers" }],
  events: { eyebrow: "STAY UPDATED", title: "What's Happening in BSA?", description: "Catch up on the latest events, announcements, and milestones happening in our community.", items: [{ title: "TESTIMONIAL DINNER", description: "A new horizon beckons, earned through the relentless dedication of our new CPAs.", image: "" }, { title: "MAY 2026 PASSERS", description: "PLM achieved a commendable passing rate of 52.94%.", image: "" }, { title: "MAY 2026 PASSERS", description: "Celebrating the achievements of our newest CPA passers.", image: "" }] },
  spotlight: { eyebrow: "ALUMNI SPOTLIGHT", quoteTitle: "Just keep going", description: "Inspiring stories of our alumni who continue to make an impact.", name: "Dante F. Falsado, CPA, CMA", position: "Professor at Pamantasan ng Lungsod ng Maynila", quote: "The values and the discipline I learned in BSA shaped the professional I am today.", image: "" },
  batches: ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"],
  memories: ["", "", "", "", ""],
  footer: { address: "General Luna corner Muralla Streets, Intramuros, Manila, 1002 Metro Manila, Philippines", email: "BSAAlumniSystem.2026@gmail.com", phone: "(02) 1234-5678 / 09123456789", copyright: "© BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila. All Rights Reserved" },
};


export default function AdminHomepage() {
  const [content, setContent] = useState(defaultContent);
  const [json, setJson] = useState(JSON.stringify(defaultContent, null, 2));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.from("homepage_content").select("content").eq("id", "main").maybeSingle()
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) throw loadError;
        if (data?.content) {
          setContent(data.content);
          setJson(JSON.stringify(data.content, null, 2));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load homepage content. Apply the homepage content migration first.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function updateJson(value) {
    setJson(value);
    try {
      const parsed = JSON.parse(value);
      if (!parsed.hero || !parsed.events || !parsed.spotlight || !Array.isArray(parsed.statistics) || !Array.isArray(parsed.batches) || !Array.isArray(parsed.memories) || !parsed.footer) {
        setError("The JSON must include hero, statistics, events, spotlight, batches, memories, and footer.");
        return;
      }
      setContent(parsed);
      setError("");
    } catch {
      setError("JSON is not valid yet. Fix the syntax before saving.");
    }
  }

  async function handleSave() {
    let parsed;
    try {
      parsed = JSON.parse(json);
      if (!parsed.hero || !parsed.events || !parsed.spotlight || !Array.isArray(parsed.statistics) || !Array.isArray(parsed.batches) || !Array.isArray(parsed.memories) || !parsed.footer) throw new Error("Missing required homepage sections.");
    } catch (saveError) {
      setError(saveError.message || "Please correct the JSON.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    const { error: saveError } = await supabase.from("homepage_content").update({ content: parsed }).eq("id", "main");
    if (saveError) setError(saveError.message);
    else {
      setContent(parsed);
      setMessage("Homepage content saved. Refresh the public homepage to see the changes.");
    }
    setSaving(false);
  }

  function resetEditor() {
    setJson(JSON.stringify(content, null, 2));
    setError("");
    setMessage("Editor reset to the last loaded/saved content.");
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="border-b border-[#ddd8c9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">Website Administration</p><h1 className="mt-1 text-2xl font-black">Homepage Content</h1><p className="mt-1 text-sm text-[#68736b]">Control the content displayed on the public homepage.</p></div>
          <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-[#d8ddd6] px-4 py-2.5 text-sm font-bold text-[#315f45] hover:bg-[#f7f5ee]"><ArrowLeft size={17}/> Back to Dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border border-[#ddd8c9] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black">Homepage content editor</h2><p className="mt-1 text-sm text-[#68736b]">Edit the JSON content for every homepage section.</p></div><div className="flex gap-2"><button onClick={resetEditor} type="button" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><RotateCcw size={15}/> Reset editor</button><button onClick={handleSave} disabled={loading || saving || Boolean(error)} type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#18392b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={16}/>{saving ? "Saving..." : "Save homepage"}</button></div></div>
            {loading ? <p className="py-12 text-center text-sm text-[#68736b]">Loading homepage content...</p> : <textarea aria-label="Homepage content JSON" spellCheck={false} value={json} onChange={(event) => updateJson(event.target.value)} className="mt-5 min-h-[680px] w-full rounded-xl border border-[#d8ddd6] bg-[#fbfcfa] p-4 font-mono text-xs leading-6 text-[#18392b] outline-none focus:border-[#b79a3b]"/>}
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
          </section>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#ddd8c9] bg-white p-5 shadow-sm"><h3 className="font-black">Sections you can control</h3><ul className="mt-3 space-y-2 text-sm text-[#536258]"><li>• Hero banner text and campus image URL</li><li>• Three homepage statistics</li><li>• What's Happening heading and featured cards</li><li>• Alumni Spotlight text, profile, and image</li><li>• Batch year buttons</li><li>• Memory Lane image URLs</li><li>• Footer contact details and copyright</li></ul></div>
            <div className="rounded-2xl border border-[#ddd8c9] bg-white p-5 shadow-sm"><h3 className="font-black">Image guidance</h3><p className="mt-2 text-sm leading-6 text-[#68736b]">Use publicly accessible HTTPS image URLs. Leave an image value blank to keep the existing built-in image. Uploading and storage configuration are intentionally not required.</p><Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#9b7819]"><Eye size={16}/> View public homepage</Link></div>
            <div className="rounded-2xl border border-[#ddd8c9] bg-white p-5 shadow-sm"><h3 className="font-black">Safe publishing</h3><p className="mt-2 text-sm leading-6 text-[#68736b]">Only admin and head_admin accounts can save. Visitors can read published content. Changes take effect after saving; this editor does not change database schema or production settings by itself.</p></div>
          </aside>
        </div>
      </main>
    </div>
  );
}
