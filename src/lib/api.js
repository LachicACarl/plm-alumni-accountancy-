import { supabase } from "./supabase";

export async function getAlumni() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getBatches() {
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .order("year", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAchievements(profileId = null) {
  let query = supabase
    .from("achievements")
    .select("*")
    .order("achievement_date", { ascending: false });

  if (profileId) {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function getCredentials(profileId = null) {
  let query = supabase
    .from("credentials")
    .select("*")
    .order("created_at", { ascending: false });

  if (profileId) {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}
