import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigin = Deno.env.get("FRONTEND_ORIGIN")?.trim() || "";

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(body: Record<string, unknown>, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function cleanText(value: unknown, field: string, maxLength: number, required = false): string | null {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(field + " is required.");
    return null;
  }
  if (typeof value !== "string") throw new Error(field + " must be text.");
  const normalized = value.trim();
  if (required && !normalized) throw new Error(field + " is required.");
  if (normalized.length > maxLength) throw new Error(field + " must be " + maxLength + " characters or fewer.");
  return normalized || null;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, origin);
  }
  if (!allowedOrigin || (origin && origin !== allowedOrigin)) {
    return jsonResponse({ error: "Origin not allowed." }, 403, origin);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase server configuration is missing.");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = req.headers.get("Authorization");
    const tokenMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) {
      return jsonResponse({ error: "Missing or invalid authorization." }, 401, origin);
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(tokenMatch[1].trim());
    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized." }, 401, origin);
    }

    const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfileError || !adminProfile || !["admin", "head_admin"].includes(adminProfile.role)) {
      return jsonResponse({ error: "Administrator access required." }, 403, origin);
    }

    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid request body." }, 400, origin);
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Enter a valid email address." }, 400, origin);
    }

    const password = body.password;
    if (typeof password !== "string" || password.length < 12 || password.length > 128) {
      return jsonResponse({ error: "Temporary password must be between 12 and 128 characters." }, 400, origin);
    }

    const firstName = cleanText(body.first_name, "First name", 80, true)!;
    const middleName = cleanText(body.middle_name, "Middle name", 80);
    const lastName = cleanText(body.last_name, "Last name", 80, true);
    const studentNumber = cleanText(body.student_number, "Student number", 40);
    const profession = cleanText(body.profession, "Profession", 120);
    const company = cleanText(body.company, "Company", 120);

    let graduationYear: number | null = null;
    if (body.graduation_year !== undefined && body.graduation_year !== null &&
      body.graduation_year !== "" && body.graduation_year !== 0) {
      graduationYear = Number(body.graduation_year);
      if (!Number.isInteger(graduationYear) || graduationYear < 1900 || graduationYear > 2100) {
        return jsonResponse({ error: "Graduation year must be between 1900 and 2100." }, 400, origin);
      }
    }

    const { data: createdUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { first_name: firstName, middle_name: middleName, last_name: lastName },
    });

    if (createUserError || !createdUser.user) {
      throw new Error(createUserError?.message || "Unable to create authentication user.");
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: createdUser.user.id,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email,
        student_number: studentNumber,
        graduation_year: graduationYear,
        profession,
        company,
        role: "alumni",
      })
      .select("id, first_name, middle_name, last_name, email, student_number, graduation_year, profession, company, role")
      .single();

    if (profileError) {
      const { error: rollbackError } = await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);
      if (rollbackError) {
        console.error("Failed to roll back newly created auth user:", rollbackError);
      }
      throw new Error(profileError.message);
    }

    return jsonResponse({
      success: true,
      user: { id: createdUser.user.id, email: createdUser.user.email },
      profile,
    }, 201, origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    const validationError = /required|must be|valid|characters or fewer/i.test(message);
    console.error("create-alumni request failed:", message);
    return jsonResponse({ error: message }, validationError ? 400 : 500, origin);
  }
});
