import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function getSupabaseConfigError() {
  if (!supabaseUrl) {
    return "Missing VITE_SUPABASE_URL. Set it to your HTTPS Supabase project URL before building.";
  }

  try {
    const url = new URL(supabaseUrl);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname) {
      return "Invalid VITE_SUPABASE_URL. Set it to a valid HTTP or HTTPS Supabase project URL.";
    }
  } catch {
    return "Invalid VITE_SUPABASE_URL. Set it to a valid HTTP or HTTPS Supabase project URL.";
  }

  if (!supabaseAnonKey) {
    return "Missing VITE_SUPABASE_ANON_KEY. Set it to the Supabase publishable/anon key before building.";
  }

  return null;
}

const configError = getSupabaseConfigError();

if (configError) {
  throw new Error(`Supabase configuration error: ${configError}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
