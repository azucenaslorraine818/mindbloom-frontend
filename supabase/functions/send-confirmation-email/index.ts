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
    const { email, first_name, verification_link, email_type } = body ? JSON.parse(body) : {};

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── 2. Guard all required env vars up front ────────────────────────────────
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

    if (!BREVO_API_KEY) {
      console.error("Missing BREVO_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: BREVO_API_KEY is not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 3. Build email based on type ───────────────────────────────────────────
    const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const displayName = first_name || "there";

    let emailSubject = "";
    let emailContent = "";

    if (email_type === "welcome") {
      emailSubject = "✨ Welcome to MindBloom! Verify your email";
      emailContent = `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#2d1b22;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;font-size:24px;">🌸 Welcome to MindBloom</h1>
          </div>

          <div style="background:#f8f7ff;padding:28px 32px;border:1px solid #e9d5ff;border-top:none;border-radius:0 0 16px 16px;">
            <p style="margin:0 0 16px;font-size:16px;">Hi <strong>${displayName}</strong>,</p>

            <p style="margin:0 0 16px;font-size:14px;color:#5f4650;line-height:1.6;">
              Welcome to <strong>MindBloom</strong>, your personal AI-powered stress journaling companion. 
              We're excited to help you on your journey toward better mental health and emotional clarity.
            </p>

            <div style="background:white;border:2px solid #6366f1;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
              <p style="margin:0 0 12px;font-size:12px;color:#8a6672;text-transform:uppercase;letter-spacing:1px;">Verify Your Email</p>
              <a href="${verification_link}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                Confirm Email Address
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#a0aec0;">or copy this link:</p>
              <p style="margin:4px 0 0;font-size:12px;word-break:break-all;color:#8a6672;">
                <code>${verification_link}</code>
              </p>
            </div>

            <p style="margin:0 0 16px;font-size:14px;color:#5f4650;line-height:1.6;">
              <strong>What you can do with MindBloom:</strong>
            </p>
            <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#5f4650;">
              <li style="margin-bottom:8px;">📝 <strong>Journal your thoughts</strong> - freely express your feelings in a safe space</li>
              <li style="margin-bottom:8px;">🤖 <strong>Get AI insights</strong> - receive personalized reflections and coping strategies</li>
              <li style="margin-bottom:8px;">📊 <strong>Track your progress</strong> - visualize your emotional journey over time</li>
              <li style="margin-bottom:8px;">🆘 <strong>Access resources</strong> - find professional help when you need it</li>
            </ul>

            <hr style="border:none;border-top:1px solid #e9d5ff;margin:20px 0;"/>
            <p style="margin:0;font-size:12px;color:#a0aec0;">
              This confirmation link expires in 24 hours. 
              Sent at ${timestamp} (Asia/Manila).
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#a0aec0;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
        </div>
      `;
    } else {
      // Default confirmation email
      emailSubject = "Confirm your MindBloom account";
      emailContent = `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#2d1b22;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;border-radius:16px 16px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;">🌸 Email Verification</h1>
          </div>

          <div style="background:#f8f7ff;padding:28px 32px;border:1px solid #e9d5ff;border-top:none;border-radius:0 0 16px 16px;">
            <p style="margin:0 0 16px;font-size:14px;">Hi <strong>${displayName}</strong>,</p>

            <p style="margin:0 0 20px;font-size:14px;color:#5f4650;line-height:1.6;">
              Please verify your email address to complete your MindBloom registration.
            </p>

            <div style="background:white;border:2px solid #6366f1;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
              <a href="${verification_link}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                Verify Email
              </a>
            </div>

            <p style="margin:0;font-size:12px;color:#a0aec0;">
              This link expires in 24 hours. Sent at ${timestamp} (Asia/Manila).
            </p>
          </div>
        </div>
      `;
    }

    // ── 4. Build email object for Brevo ────────────────────────────────────────
    const emailBody = {
      sender: { name: "MindBloom", email: "azucenaslorraine@gmail.com" },
      to: [
        {
          email: email,
          name: displayName,
        },
      ],
      subject: emailSubject,
      htmlContent: emailContent,
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