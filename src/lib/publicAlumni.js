import { supabase } from "./supabase";

// PostgREST may cap each RPC response at the project max_rows setting.
// Fetch stable, ordered pages so public directories do not silently truncate.
export async function fetchAllPublicAlumni({ pageSize = 500, maxPages = 100 } = {}) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 1000) {
    throw new RangeError("pageSize must be an integer between 1 and 1000.");
  }
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new RangeError("maxPages must be a positive integer.");
  }

  const records = [];
  for (let page = 0; page < maxPages; page += 1) {
    const from = page * pageSize;
    const { data, error } = await supabase
      .rpc("get_public_alumni")
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    records.push(...rows);
    if (rows.length < pageSize) return records;
  }

  throw new Error(`Public alumni pagination exceeded the safety limit of ${maxPages} pages.`);
}
