import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Save, RotateCcw, Plus, Trash2, Image as ImageIcon, Pencil } from "lucide-react";
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

const inputClass = "mt-1 w-full rounded-lg border border-[#d8ddd6] bg-white px-3 py-2.5 text-sm text-[#18392b] outline-none focus:border-[#b79a3b]";
const labelClass = "block text-xs font-bold uppercase tracking-wide text-[#657268]";
const clone = (value) => JSON.parse(JSON.stringify(value));
const validImage = (value) => !value || (/^https:\/\//i.test(value) && !/[<>]/.test(value));

function Field({ label, value, onChange, multiline = false, type = "text", hint }) {
  const Control = multiline ? "textarea" : "input";
  return <label className="block"><span className={labelClass}>{label}</span><Control type={multiline ? undefined : type} rows={multiline ? 3 : undefined} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={inputClass}/>{hint && <span className="mt-1 block text-xs text-[#879188]">{hint}</span>}</label>;
}

function ImageField({ label, value, onChange }) {
  return <div><Field label={label} value={value} onChange={onChange} hint="Paste a publicly accessible HTTPS image URL. Leave blank to use the built-in image."/><div className="mt-2 flex min-h-24 items-center gap-3 rounded-lg border border-dashed border-[#d8ddd6] bg-[#fafbf8] p-2">{value && validImage(value) ? <img src={value} alt={label + " preview"} className="h-20 w-28 rounded-md object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }}/>:<div className="flex h-20 w-28 items-center justify-center rounded-md bg-[#edf1eb] text-[#829084]"><ImageIcon/></div>}<span className="text-xs text-[#68736b]">{value ? (validImage(value) ? "Image preview (if URL is reachable)" : "Use an HTTPS image URL") : "Default project image will be used"}</span></div></div>;
}

function Section({ title, description, children }) {
  return <section className="rounded-2xl border border-[#ddd8c9] bg-white p-5 shadow-sm"><div className="mb-4 border-b border-[#eeeae0] pb-3"><h3 className="font-black text-[#234634]">{title}</h3>{description && <p className="mt-1 text-xs text-[#68736b]">{description}</p>}</div><div className="grid gap-4 sm:grid-cols-2">{children}</div></section>;
}

function Preview({ content }) {
  const image = (url) => validImage(url) && url ? url : "";
  return <div className="overflow-hidden rounded-xl border border-[#d8ddd6] bg-white text-[#263b30]">
    <div className="relative min-h-64 bg-[#1b4931] p-7 text-white" style={image(content.hero.campusImage) ? { backgroundImage: `linear-gradient(90deg,rgba(18,61,41,.92),rgba(23,75,50,.35)),url("${content.hero.campusImage}")`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
      <p className="text-xs font-bold tracking-widest text-[#e4c35b]">{content.hero.eyebrow}</p><h2 className="mt-3 text-4xl font-black">{content.hero.title}</h2><p className="mt-3 max-w-lg font-serif">{content.hero.tagline}</p><p className="mt-2 max-w-lg text-sm text-white/85">{content.hero.description}</p>
    </div>
    <div className="grid grid-cols-3 gap-2 bg-[#f8f8f3] p-4 text-center">{content.statistics.map((item, i) => <div key={i}><strong className="block text-lg text-[#31563f]">{item.value}</strong><span className="text-xs">{item.label}</span></div>)}</div>
    <div className="p-5"><p className="text-xs font-bold tracking-widest text-[#b28b1e]">{content.events.eyebrow}</p><h3 className="mt-1 text-xl font-bold">{content.events.title}</h3><p className="mt-2 text-sm text-[#68736b]">{content.events.description}</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{content.events.items.map((item,i)=><article key={i} className="overflow-hidden rounded-lg border"><div className="h-24 bg-[#edf1eb]">{image(item.image) && <img src={item.image} alt="" className="h-full w-full object-cover"/>}</div><div className="p-3"><strong className="text-xs">{item.title}</strong><p className="mt-1 text-xs text-[#68736b]">{item.description}</p></div></article>)}</div></div>
    <div className="bg-[#214a32] p-5 text-white"><p className="text-xs font-bold text-[#e4c35b]">{content.spotlight.eyebrow}</p><h3 className="mt-2 text-xl font-bold">{content.spotlight.quoteTitle}</h3><p className="mt-2 text-sm">{content.spotlight.quote}</p><p className="mt-3 text-sm font-bold">{content.spotlight.name}</p><p className="text-xs text-white/75">{content.spotlight.position}</p></div>
    <div className="p-5"><strong className="text-sm">EXPLORE BY BATCH</strong><div className="mt-3 flex flex-wrap gap-2">{content.batches.map((batch,i)=><span key={i} className="rounded bg-[#e6c66c] px-3 py-2 text-xs font-bold text-white">{batch}</span>)}</div><strong className="mt-5 block text-sm">MEMORY LANE</strong><div className="mt-2 grid grid-cols-5 gap-2">{content.memories.map((url,i)=><div key={i} className="h-12 rounded bg-[#edf1eb]">{image(url) && <img src={url} alt="" className="h-full w-full rounded object-cover"/>}</div>)}</div></div>
    <div className="bg-[#fff3d1] p-5 text-xs leading-5"><strong>CONTACT US</strong><p>{content.footer.address}</p><p>{content.footer.email} · {content.footer.phone}</p><p className="mt-3">{content.footer.copyright}</p></div>
  </div>;
}

export default function AdminHomepage() {
  const [content, setContent] = useState(clone(defaults));
  const [savedContent, setSavedContent] = useState(clone(defaults));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.from("homepage_content").select("content").eq("id", "main").maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) throw loadError;
        if (active && data?.content) { setContent({ ...clone(defaults), ...data.content }); setSavedContent({ ...clone(defaults), ...data.content }); }
      })
      .catch((loadError) => { if (active) setError(loadError.message || "Unable to load homepage content. Apply the homepage content migration first."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function setAt(path, value) {
    setContent((current) => {
      const next = clone(current);
      let target = next;
      for (const key of path.slice(0, -1)) target = target[key];
      target[path[path.length - 1]] = value;
      return next;
    });
    setError(""); setMessage("");
  }
  function updateArray(name, index, key, value) {
    const next = clone(content[name]); next[index] = key === null ? value : { ...next[index], [key]: value };
    setAt([name], next);
  }
  function validate() {
    const required = ["hero","events","spotlight","footer"];
    if (!required.every((key) => content[key] && typeof content[key] === "object")) return "A required homepage section is missing.";
    if (!Array.isArray(content.statistics) || content.statistics.length !== 3) return "Please keep exactly three homepage statistics.";
    if (!Array.isArray(content.events.items) || content.events.items.length < 1 || content.events.items.length > 6) return "Add between 1 and 6 featured event cards.";
    if (!Array.isArray(content.batches) || content.batches.length < 1 || content.batches.length > 20) return "Add between 1 and 20 batch years.";
    if (!Array.isArray(content.memories) || content.memories.length > 10) return "Memory Lane supports up to 10 image slots.";
    const strings = [content.hero.eyebrow,content.hero.title,content.hero.tagline,content.hero.description,content.hero.campusImage,content.events.eyebrow,content.events.title,content.events.description,content.spotlight.eyebrow,content.spotlight.quoteTitle,content.spotlight.description,content.spotlight.name,content.spotlight.position,content.spotlight.quote,content.spotlight.image,content.footer.address,content.footer.email,content.footer.phone,content.footer.copyright,...content.statistics.flatMap(x=>[x.value,x.label]),...content.events.items.flatMap(x=>[x.title,x.description,x.image]),...content.batches,...content.memories];
    if (!strings.every((value) => typeof value === "string")) return "All content fields must contain text.";
    const images = [content.hero.campusImage,content.spotlight.image,...content.events.items.map(x=>x.image),...content.memories];
    if (!images.every(validImage)) return "Images must use valid HTTPS URLs (or be left blank).";
    if (!content.hero.title.trim() || !content.events.title.trim()) return "Hero and events headings cannot be blank.";
    return "";
  }
  async function publish() {
    const validation = validate();
    if (validation) { setError(validation); setPreviewing(false); return; }
    setSaving(true); setError(""); setMessage("");
    const { error: saveError } = await supabase.from("homepage_content").update({ content }).eq("id", "main");
    if (saveError) setError(saveError.message);
    else { setSavedContent(clone(content)); setMessage("Homepage published successfully. The public homepage will load the updated content."); setPreviewing(false); }
    setSaving(false);
  }
  function reset() { setContent(clone(savedContent)); setError(""); setMessage("Unsaved edits discarded."); setPreviewing(false); }

  return <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
    <header className="border-b border-[#ddd8c9] bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b28b1e]">Website Administration</p><h1 className="mt-1 text-2xl font-black">Homepage Content</h1><p className="mt-1 text-sm text-[#68736b]">Manage every editable section on the public homepage.</p></div><Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-[#d8ddd6] px-4 py-2.5 text-sm font-bold text-[#315f45]"><ArrowLeft size={17}/> Dashboard</Link></div></header>
    <main className="mx-auto max-w-7xl px-6 py-8">
      {loading ? <p className="py-16 text-center">Loading homepage content...</p> : <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Section title="Hero banner" description="The first section visitors see."><Field label="Eyebrow" value={content.hero.eyebrow} onChange={v=>setAt(["hero","eyebrow"],v)}/><Field label="Main heading" value={content.hero.title} onChange={v=>setAt(["hero","title"],v)}/><Field label="Tagline" value={content.hero.tagline} onChange={v=>setAt(["hero","tagline"],v)} /><Field label="Description" value={content.hero.description} onChange={v=>setAt(["hero","description"],v)} multiline/><div className="sm:col-span-2"><ImageField label="Campus background image" value={content.hero.campusImage} onChange={v=>setAt(["hero","campusImage"],v)}/></div></Section>
          <Section title="Homepage statistics" description="Exactly three number-and-label highlights.">{content.statistics.map((stat,i)=><div key={i} className="grid grid-cols-2 gap-2 rounded-lg bg-[#f8faf7] p-3"><Field label={`Statistic ${i+1}`} value={stat.value} onChange={v=>updateArray("statistics",i,"value",v)}/><Field label="Label" value={stat.label} onChange={v=>updateArray("statistics",i,"label",v)}/></div>)}</Section>
          <Section title="Featured events" description="Manage the homepage event cards (1–6 cards)."><Field label="Section eyebrow" value={content.events.eyebrow} onChange={v=>setAt(["events","eyebrow"],v)}/><Field label="Section heading" value={content.events.title} onChange={v=>setAt(["events","title"],v)}/><div className="sm:col-span-2"><Field label="Section description" value={content.events.description} onChange={v=>setAt(["events","description"],v)} multiline/></div>{content.events.items.map((item,i)=><div key={i} className="sm:col-span-2 rounded-xl border border-[#e5e8e1] p-4"><div className="mb-3 flex items-center justify-between"><strong className="text-sm">Event card {i+1}</strong><button type="button" onClick={()=>setAt(["events","items"],content.events.items.filter((_,j)=>j!==i))} className="text-xs font-bold text-red-700"><Trash2 size={14} className="mr-1 inline"/>Remove</button></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Title" value={item.title} onChange={v=>updateArray("events.items",i,"title",v)}/><Field label="Description" value={item.description} onChange={v=>updateArray("events.items",i,"description",v)} multiline/><div className="sm:col-span-2"><ImageField label="Event image" value={item.image} onChange={v=>updateArray("events.items",i,"image",v)}/></div></div></div>)}<div className="sm:col-span-2"><button type="button" disabled={content.events.items.length>=6} onClick={()=>setAt(["events","items"],[...content.events.items,{title:"New event",description:"Event description",image:""}])} className="rounded-lg border border-[#b9c8ba] px-3 py-2 text-sm font-bold disabled:opacity-40"><Plus size={15} className="mr-1 inline"/> Add event card</button></div></Section>
          <Section title="Alumni spotlight" description="The featured alumni profile and quotation."><Field label="Eyebrow" value={content.spotlight.eyebrow} onChange={v=>setAt(["spotlight","eyebrow"],v)}/><Field label="Quote heading" value={content.spotlight.quoteTitle} onChange={v=>setAt(["spotlight","quoteTitle"],v)}/><Field label="Description" value={content.spotlight.description} onChange={v=>setAt(["spotlight","description"],v)} multiline/><Field label="Alumni name" value={content.spotlight.name} onChange={v=>setAt(["spotlight","name"],v)}/><Field label="Position / credentials" value={content.spotlight.position} onChange={v=>setAt(["spotlight","position"],v)}/><div className="sm:col-span-2"><Field label="Alumni quote" value={content.spotlight.quote} onChange={v=>setAt(["spotlight","quote"],v)} multiline/></div><div className="sm:col-span-2"><ImageField label="Alumni photo" value={content.spotlight.image} onChange={v=>setAt(["spotlight","image"],v)}/></div></Section>
          <Section title="Batch years" description="These appear as batch navigation chips.">{content.batches.map((batch,i)=><div key={i} className="flex items-end gap-2"><div className="flex-1"><Field label={`Batch ${i+1}`} value={batch} onChange={v=>updateArray("batches",i,null,v)}/></div><button type="button" onClick={()=>setAt(["batches"],content.batches.filter((_,j)=>j!==i))} aria-label={`Remove batch ${batch}`} className="mb-1 rounded-lg border p-2 text-red-700"><Trash2 size={16}/></button></div>)}<button type="button" disabled={content.batches.length>=20} onClick={()=>setAt(["batches"],[...content.batches,String(new Date().getFullYear())])} className="rounded-lg border border-[#b9c8ba] px-3 py-2 text-sm font-bold disabled:opacity-40"><Plus size={15} className="mr-1 inline"/> Add batch</button></Section>
          <Section title="Memory Lane" description="Add up to 10 public HTTPS image URLs."><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">{content.memories.map((url,i)=><div key={i}><ImageField label={`Memory image ${i+1}`} value={url} onChange={v=>updateArray("memories",i,null,v)}/><button type="button" onClick={()=>setAt(["memories"],content.memories.filter((_,j)=>j!==i))} className="mt-2 text-xs font-bold text-red-700"><Trash2 size={13} className="mr-1 inline"/> Remove image</button></div>)}</div><button type="button" disabled={content.memories.length>=10} onClick={()=>setAt(["memories"],[...content.memories,""])} className="rounded-lg border border-[#b9c8ba] px-3 py-2 text-sm font-bold disabled:opacity-40"><Plus size={15} className="mr-1 inline"/> Add image slot</button></Section>
          <Section title="Footer and contact details"><Field label="Address" value={content.footer.address} onChange={v=>setAt(["footer","address"],v)} multiline/><Field label="Email" value={content.footer.email} onChange={v=>setAt(["footer","email"],v)} type="email"/><Field label="Phone" value={content.footer.phone} onChange={v=>setAt(["footer","phone"],v)}/><div className="sm:col-span-2"><Field label="Copyright text" value={content.footer.copyright} onChange={v=>setAt(["footer","copyright"],v)}/></div></Section>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
          <div className="sticky bottom-3 flex flex-wrap justify-end gap-2 rounded-xl border border-[#ddd8c9] bg-white/95 p-3 shadow-lg backdrop-blur"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold"><RotateCcw size={15}/> Discard edits</button><button type="button" onClick={()=>{const problem=validate();if(problem){setError(problem);return;}setError("");setPreviewing(true);}} className="inline-flex items-center gap-2 rounded-lg bg-[#18392b] px-4 py-2.5 text-sm font-bold text-white"><Eye size={16}/> Preview before publish</button></div>
        </div>
        <aside className="space-y-4 xl:sticky xl:top-5"><div className="rounded-2xl border border-[#ddd8c9] bg-white p-5"><h3 className="font-black">Homepage controls</h3><p className="mt-2 text-sm leading-6 text-[#68736b]">All homepage sections are editable here. Changes stay in this editor until you review the preview and choose Publish.</p><ul className="mt-3 space-y-2 text-sm text-[#536258]"><li>✓ Hero banner and background</li><li>✓ Statistics and featured events</li><li>✓ Alumni Spotlight</li><li>✓ Batch years and Memory Lane</li><li>✓ Footer and contact information</li></ul><Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#9b7819]"><Eye size={16}/> Open live homepage</Link></div><div className="rounded-2xl border border-[#ddd8c9] bg-white p-5"><h3 className="font-black">Publishing safeguards</h3><p className="mt-2 text-sm leading-6 text-[#68736b]">Only admin and head_admin accounts can save through database RLS. Public visitors have read-only access. Image URLs must be HTTPS. No file-storage bucket is required.</p></div></aside>
      </div>}
    </main>
    {previewing && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 sm:p-8"><div className="mx-auto max-w-5xl rounded-2xl bg-[#f7f5ee] p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-[#b28b1e]">Review changes</p><h2 className="text-xl font-black">Homepage preview</h2><p className="text-sm text-[#68736b]">This is a content preview. Check all text and images before publishing.</p></div><button type="button" onClick={()=>setPreviewing(false)} className="rounded-lg border bg-white px-3 py-2 text-sm font-bold"><Pencil size={14} className="mr-1 inline"/> Back to edit</button></div><Preview content={content}/><div className="mt-4 flex flex-wrap justify-end gap-2"><button type="button" onClick={()=>setPreviewing(false)} className="rounded-lg border bg-white px-4 py-2.5 text-sm font-bold">Continue editing</button><button type="button" onClick={publish} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#18392b] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={16}/>{saving ? "Publishing..." : "Publish homepage changes"}</button></div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</div></div>}
  </div>;
}
