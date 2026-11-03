import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileSpreadsheet, Search, Upload, RefreshCw, GraduationCap } from "lucide-react";
import { supabase } from "../lib/supabase";

function parseCsv(source) {
  const rows = [];
  let row = [], value = "", quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i], next = source[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(value.trim()); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim()); value = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else value += char;
  }
  row.push(value.trim());
  if (row.some((cell) => cell !== "")) rows.push(row);
  if (rows.length < 2) throw new Error("The CSV must contain a header row and at least one report.");
  const rawHeaders = rows.shift();
  const headers = rawHeaders.map((header) =>
    header.replace(/^\uFEFF/, "").trim().replace(/^["']|["']$/g, "").toLowerCase().replace(/[\s_-]+/g, "")
  );
  const find = (...keys) => headers.findIndex((header) => keys.includes(header));
  const dateIndex = find("date", "reportdate", "createdat", "timestamp");
  const fileIndex = find("filename", "file", "mediafilename");
  const mediaIndex = find("mediatype", "type");
  const resultIndex = find("result", "classification", "prediction");
  const confidenceIndex = find("confidencescore", "confidence", "score");
  const analysisIndex = find("analysis", "details", "explanation");
  const missing = [];
  if (fileIndex < 0) missing.push("File Name");
  if (resultIndex < 0) missing.push("Result");
  if (missing.length) {
    throw new Error("This CSV is missing required TruthLens columns: " + missing.join(", ") +
      ". Detected: " + rawHeaders.join(", "));
  }
  return rows.map((cells, index) => {
    const rawConfidence = confidenceIndex >= 0 ? (cells[confidenceIndex] || "").replace(/%$/, "").trim() : "";
    const confidence = rawConfidence === "" ? null : Number(rawConfidence);
    return {
      rowNumber: index + 2,
      report_date: dateIndex >= 0 && cells[dateIndex] ? cells[dateIndex] : null,
      file_name: cells[fileIndex] || "",
      media_type: mediaIndex >= 0 ? (cells[mediaIndex] || null) : null,
      result: cells[resultIndex] || "",
      confidence_score: confidence,
      analysis: analysisIndex >= 0 ? (cells[analysisIndex] || null) : null,
      invalid: !(cells[fileIndex] || "").trim() || !(cells[resultIndex] || "").trim() ||
        (confidence !== null && (!Number.isFinite(confidence) || confidence < 0 || confidence > 100)) ||
        (dateIndex >= 0 && cells[dateIndex] && Number.isNaN(Date.parse(cells[dateIndex]))),
    };
  });
}

function toDateOnly(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

export default function AdminTruthLensReports() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadReports() {
    setLoading(true);
    const { data, error: loadError } = await supabase.from("truthlens_reports")
      .select("id, report_date, file_name, media_type, result, confidence_score, analysis, created_at")
      .order("created_at", { ascending: false }).limit(500);
    if (loadError) {
      setError(loadError.code === "PGRST205"
        ? "TruthLens report storage is not installed yet. The database migration must be reviewed and applied before this module can save reports."
        : loadError.message);
      setReports([]);
    } else {
      setError("");
      setReports(data || []);
    }
    setLoading(false);
  }

  useEffect(() => { void loadReports(); }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reports;
    return reports.filter((item) =>
      [item.file_name, item.media_type, item.result, item.analysis].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [reports, search]);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(""); setMessage(""); setRows([]); setFileName(file.name);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV export from TruthLens.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The CSV is larger than 10 MB. Split it into smaller files and try again.");
      return;
    }
    try {
      const parsed = parseCsv((await file.text()).replace(/^\uFEFF/, ""));
      setRows(parsed);
      if (parsed.some((item) => item.invalid)) setError("Some rows have missing or invalid values. Correct those rows in the CSV before importing.");
    } catch (err) { setError(err.message || "Unable to read this CSV."); }
  }

  async function handleImport() {
    if (!rows.length || rows.some((item) => item.invalid) || busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Your session expired. Sign in again.");
      const payload = rows.map(({ report_date, file_name, media_type, result, confidence_score, analysis }) => ({
        report_date: toDateOnly(report_date), file_name: file_name.trim(),
        media_type: media_type?.trim() || null, result: result.trim(),
        confidence_score, analysis: analysis?.trim() || null, imported_by: user.id,
      }));
      const { error: insertError } = await supabase.from("truthlens_reports").insert(payload);
      if (insertError) throw insertError;
      setMessage("Successfully imported " + payload.length + " TruthLens report(s).");
      setRows([]); setFileName("");
      await loadReports();
    } catch (err) { setError(err.message || "Import failed. No records were confirmed as saved."); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#18392b]">
      <header className="sticky top-0 z-40 border-b border-[#315442] bg-[#18392b] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/admin" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37] text-[#18392b]"><GraduationCap size={24}/></span><span><span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">PLM College of Accountancy</span><span className="font-serif text-base font-bold">BSA Alumni Administration</span></span></Link>
          <Link to="/admin" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10">Dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Link to="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#b28b1e]"><ArrowLeft size={17}/>Back to Admin Dashboard</Link>
        <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28b1e]">Separate report storage</p><h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">TruthLens Reports</h1><p className="mt-2 text-sm text-gray-500">Import and review TruthLens CSV analysis exports. These records are separate from the alumni student roster.</p></div>
        <section className="rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9dc]"><FileSpreadsheet size={21}/></span><div><h2 className="font-serif text-xl font-bold">Import TruthLens CSV</h2><p className="text-xs text-gray-500">Accepted columns: Date, File Name, Media Type, Result, Confidence Score, Analysis</p></div></div>
          <input type="file" accept=".csv,text/csv" onChange={handleFile} className="block w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#18392b] file:px-4 file:py-2 file:font-semibold file:text-white"/>
          {fileName && <p className="mt-2 text-xs text-gray-500">Selected: {fileName}</p>}
          {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div>}
          {rows.length > 0 && <div className="mt-5 overflow-hidden rounded-2xl border border-[#ddd7c8]">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f7f5ee] px-4 py-3"><p className="text-sm font-bold">{rows.length} rows detected · {rows.filter((item) => !item.invalid).length} valid</p><p className="text-xs text-gray-500">Review before importing</p></div>
            <div className="max-h-80 overflow-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="sticky top-0 bg-[#18392b] text-white"><tr>{["Date","File Name","Media Type","Result","Confidence","Analysis","Validation"].map((name)=><th key={name} className="px-3 py-3">{name}</th>)}</tr></thead><tbody className="divide-y divide-[#eee9df]">{rows.slice(0,300).map((item)=><tr key={item.rowNumber} className={item.invalid?"bg-red-50":""}><td className="px-3 py-3">{item.report_date || "—"}</td><td className="px-3 py-3">{item.file_name || "—"}</td><td className="px-3 py-3">{item.media_type || "—"}</td><td className="px-3 py-3">{item.result || "—"}</td><td className="px-3 py-3">{item.confidence_score ?? "—"}</td><td className="max-w-xs truncate px-3 py-3">{item.analysis || "—"}</td><td className="px-3 py-3 font-semibold">{item.invalid?<span className="text-red-600">Invalid</span>:<span className="text-green-700">Ready</span>}</td></tr>)}</tbody></table></div>
            {rows.length>300&&<p className="p-3 text-xs text-gray-500">Showing first 300 rows. All rows will be imported.</p>}
          </div>}
          <div className="mt-5 flex flex-wrap justify-end gap-3"><button type="button" onClick={()=>{setRows([]);setFileName("");setError("");setMessage("");}} disabled={busy} className="rounded-xl border border-[#d8d2c2] px-5 py-3 text-sm font-bold hover:bg-[#f7f5ee]">Clear</button><button type="button" onClick={handleImport} disabled={busy||!rows.length||rows.some((item)=>item.invalid)} className="inline-flex items-center gap-2 rounded-xl bg-[#18392b] px-5 py-3 text-sm font-bold text-white hover:bg-[#24513d] disabled:cursor-not-allowed disabled:opacity-50"><Upload size={17}/>{busy?"Importing...":"Import TruthLens Reports"}</button></div>
        </section>
        <section className="mt-8 rounded-3xl border border-[#ddd7c8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-xl font-bold">Imported Reports</h2><p className="text-xs text-gray-500">Latest 500 reports stored separately from alumni records</p></div><button type="button" onClick={loadReports} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#d8d2c2] px-4 py-2 text-sm font-semibold"><RefreshCw size={15}/>Refresh</button></div>
          <div className="relative mt-4"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search file name, result, media type, or analysis..." className="w-full rounded-xl border border-[#d8d2c2] bg-[#fbfaf6] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#18392b]"/></div>
          {loading?<p className="py-8 text-center text-sm text-gray-500">Loading reports...</p>:filteredReports.length===0?<p className="py-8 text-center text-sm text-gray-500">No TruthLens reports found.</p>:<div className="mt-4 overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-[#f7f5ee] text-xs uppercase tracking-wide text-gray-500"><tr>{["Date","File Name","Media Type","Result","Confidence Score","Analysis"].map((name)=><th key={name} className="px-4 py-3">{name}</th>)}</tr></thead><tbody className="divide-y divide-[#eee9df]">{filteredReports.map((item)=><tr key={item.id}><td className="px-4 py-3">{item.report_date||"—"}</td><td className="px-4 py-3 font-semibold">{item.file_name}</td><td className="px-4 py-3">{item.media_type||"—"}</td><td className="px-4 py-3">{item.result}</td><td className="px-4 py-3">{item.confidence_score??"—"}</td><td className="max-w-sm truncate px-4 py-3" title={item.analysis||""}>{item.analysis||"—"}</td></tr>)}</tbody></table></div>}
        </section>
      </main>
    </div>
  );
}
