import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── 1. Parse request body ──────────────────────────────────────────────────
    const body = await req.json();
    const {
      id,
      first_name,
      last_name,
      date_of_birth,
      age,
      sex,
      phone,
      emergency_contact_name,
      emergency_contact_email,
    } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing user id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── 2. Get Supabase environment variables ───────────────────────────────────
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing Supabase env vars" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 3. Create profile in database using service role ────────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id,
          first_name,
          last_name,
          date_of_birth,
          age,
          sex: sex || "Prefer not to say",
          phone: phone || null,
          emergency_contact_name,
          emergency_contact_email,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Profile creation error:", insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to create profile",
          details: insertError.message,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, profile }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled edge function error:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
