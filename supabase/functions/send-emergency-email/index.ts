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
    // ── 1. Parse body ──────────────────────────────────────────────────────────
    const body = await req.text();
    const { user_id, message, score } = body ? JSON.parse(body) : {};

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── 2. Guard all required env vars up front ────────────────────────────────
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing Supabase env vars" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!BREVO_API_KEY) {
      console.error("Missing BREVO_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: BREVO_API_KEY is not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 3. Fetch user profile ──────────────────────────────────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, emergency_contact_name, emergency_contact_email, phone")
      .eq("id", user_id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(
        JSON.stringify({ error: "Profile not found", details: profileError.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { emergency_contact_name, emergency_contact_email, first_name, last_name, phone } =
      profile;

    if (!emergency_contact_email) {
      return new Response(
        JSON.stringify({ error: "No emergency contact email set on this profile" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 4. Build email ─────────────────────────────────────────────────────────
    const userName =
      [first_name, last_name].filter(Boolean).join(" ") || "A MindBloom user";
    const snippet = message?.slice(0, 300) || "(no message)";
    const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const scoreDisplay = score != null ? `${score}%` : "N/A";

    const emailBody = {
      sender: { name: "MindBloom", email: "azucenaslorraine@gmail.com" },
      to: [
        {
          email: emergency_contact_email,
          name: emergency_contact_name || "Emergency Contact",
        },
      ],
      subject: `⚠️ Urgent: ${userName} may need support`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#2d1b22;">
          <div style="background:linear-gradient(135deg,#e8607a,#f4a3b5);padding:28px 32px;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;">🌸 MindBloom Emergency Alert</h1>
          </div>

          <div style="background:#fff8fa;padding:28px 32px;border:1px solid #f4c0cf;border-top:none;border-radius:0 0 16px 16px;">
            <p style="margin:0 0 16px;">Dear <strong>${emergency_contact_name || "Emergency Contact"}</strong>,</p>

            <p style="margin:0 0 16px;">
              You are listed as the emergency contact for <strong>${userName}</strong> on MindBloom,
              an AI-powered stress journaling app.
            </p>

            <div style="background:#fff0f3;border-left:4px solid #e8607a;padding:16px 18px;border-radius:8px;margin:0 0 20px;">
              <p style="margin:0;font-weight:700;color:#c0475f;">⚠️ Critical Distress Detected</p>
              <p style="margin:8px 0 0;font-size:14px;color:#5f4650;">
                MindBloom's AI has detected signs of significant emotional distress in a recent journal entry.
                The emotional stress score was <strong>${scoreDisplay}</strong>.
              </p>
            </div>

            <p style="margin:0 0 8px;font-weight:600;font-size:14px;color:#8a6672;">Excerpt from their entry:</p>
            <div style="background:#f5f5f5;padding:14px 16px;border-radius:8px;font-size:14px;color:#5f4650;font-style:italic;margin:0 0 20px;">
              "${snippet}${(message?.length ?? 0) > 300 ? "…" : ""}"
            </div>

            <p style="margin:0 0 20px;font-size:14px;color:#5f4650;">
              We encourage you to reach out to <strong>${userName}</strong> as soon as possible
              to check in and offer support. If you believe they are in immediate danger,
              please contact emergency services.
            </p>

            ${phone ? `<p style="margin:0 0 20px;font-size:14px;color:#5f4650;">Their registered phone number: <strong>${phone}</strong></p>` : ""}

            <div style="background:#fde8ed;border-radius:12px;padding:14px 16px;margin:0 0 20px;">
              <p style="margin:0;font-size:13px;color:#8a6672;">
                <strong>Crisis Resources (Philippines):</strong><br/>
                • Hopeline PH: <strong>02-8804-4673</strong><br/>
                • NCMH Crisis Hotline: <strong>1553</strong><br/>
                • In Touch Crisis Line: <strong>02-8893-7603</strong>
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #f4c0cf;margin:20px 0;"/>
            <p style="margin:0;font-size:12px;color:#a0aec0;">
              This alert was sent automatically by MindBloom because ${userName} listed you as their emergency contact.
              Sent at ${timestamp} (Asia/Manila).
            </p>
          </div>
        </div>
      `,
    };

    // ── 5. Send via Brevo ──────────────────────────────────────────────────────
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const brevoData = await brevoRes.json();

    if (!brevoRes.ok) {
      const brevoError = brevoData?.message || brevoData?.error || JSON.stringify(brevoData);
      console.error("Brevo API error:", brevoError);
      return new Response(
        JSON.stringify({
          error: `Brevo rejected the request: ${brevoError}`,
          details: brevoData,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, id: brevoData.messageId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled edge function error:", err);
    return new Response(JSON.stringify({ error: err.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});