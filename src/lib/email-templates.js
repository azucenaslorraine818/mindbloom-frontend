// Email template builder for all MindBloom email types
export function buildEmailTemplate(emailType, data) {
  if (emailType === "welcome") {
    return buildWelcomeEmail(data);
  } else if (emailType === "suicide_detection") {
    return buildSuicideDetectionEmail(data);
  } else if (emailType === "high_stress") {
    return buildHighStressEmail(data);
  }
  return null;
}

function buildWelcomeEmail(data) {
  const { first_name } = data;

  return {
    subject: "Welcome to MindBloom - Verify Your Email",
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 0; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #e8607a 0%, #d84a63 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; margin-bottom: 20px; }
    .greeting strong { color: #e8607a; }
    .description { color: #666; margin-bottom: 30px; line-height: 1.8; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #e8607a 0%, #d84a63 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 30px 0; }
    .features { background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0; }
    .features h3 { color: #e8607a; margin-top: 0; font-size: 16px; }
    .feature-item { display: flex; align-items: center; margin: 12px 0; color: #666; }
    .feature-icon { font-size: 20px; margin-right: 12px; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    .divider { height: 1px; background: #eee; margin: 25px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌸 Welcome to MindBloom</h1>
      <p>Your Mental Health Journey Starts Here</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi <strong>${first_name || "there"}</strong>! 👋
      </div>
      
      <div class="description">
        We're thrilled you've joined MindBloom. This is a safe, private space where you can journal freely about your feelings, track your mental health, and get personalized AI insights to help you understand yourself better.
      </div>
      
      <div style="text-align: center;">
        <p style="color: #666; font-size: 14px;">Your email has been confirmed! You can now log in and start journaling.</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="features">
        <h3>✨ What You Can Do:</h3>
        <div class="feature-item">
          <span class="feature-icon">📝</span>
          <span>Write freely about your feelings and experiences</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🤖</span>
          <span>Get AI-powered insights about your emotional patterns</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📊</span>
          <span>Track mood, stress levels, and mental health trends</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🆘</span>
          <span>Access crisis resources and get emergency alerts if needed</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔒</span>
          <span>Everything is encrypted and completely private</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div style="color: #666; font-size: 14px;">
        <p style="margin-top: 0;">Need help? Visit our FAQ page or reach out to our support team.</p>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 15px 0;">© 2026 MindBloom. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

function buildSuicideDetectionEmail(data) {
  const { emergency_contact_name, user_name, entry_text } = data;

  return {
    subject: `🆘 URGENT: ${user_name} May Be In Crisis - MindBloom Alert`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 0; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #e8607a 0%, #d84a63 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .alert-box { background: #ffebee; border-left: 4px solid #e8607a; padding: 15px; margin: 20px 0; }
    .alert-box h2 { margin-top: 0; color: #e8607a; }
    .crisis-resources { background: #fce4ec; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .crisis-resources h3 { color: #e8607a; margin-top: 0; }
    .crisis-resources ul { margin: 10px 0; padding-left: 20px; }
    .crisis-resources li { margin: 8px 0; }
    .entry-preview { background: #f0f0f0; padding: 15px; border-left: 3px solid #999; margin: 15px 0; font-style: italic; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🆘 MindBloom Emergency Alert</h1>
    </div>
    
    <div class="content">
      <p>Dear <strong>${emergency_contact_name || "Friend"}</strong>,</p>
      
      <p>You are listed as the emergency contact for <strong>${user_name}</strong> on MindBloom, an AI-powered mental health journaling app.</p>
      
      <div class="alert-box">
        <h2>⚠️ CRITICAL: Suicidal Thoughts Detected</h2>
        <p><strong>${user_name} has expressed suicidal ideation in their journal entry.</strong> This requires immediate attention.</p>
      </div>
      
      <h3>What They Wrote:</h3>
      <div class="entry-preview">
        ${entry_text.replace(/\n/g, "<br />")}
      </div>
      
      <h2 style="color: #e8607a;">⚡ IMMEDIATE ACTION NEEDED:</h2>
      <p><strong>Please reach out to ${user_name} immediately to check on their safety and wellbeing.</strong></p>
      
      <div class="crisis-resources">
        <h3>Crisis Resources - Share These:</h3>
        <ul>
          <li><strong>🇵🇭 Philippines:</strong><br/>
              National Center for Mental Health Crisis Hotline: <strong>1553</strong><br/>
              In Touch Crisis Line: <strong>(02) 8893-7603</strong> or <strong>0917-800-1123</strong><br/>
              Emergency: <strong>911</strong></li>
          <li><strong>🇺🇸 USA:</strong> Call <strong>988</strong> (Suicide Prevention Lifeline)<br/>
              Text HOME to 741741 (Crisis Text Line)</li>
          <li><strong>🇬🇧 UK:</strong> Call <strong>116 123</strong> (Samaritans)</li>
          <li><strong>🇨🇦 Canada:</strong> Call <strong>1-833-456-4566</strong></li>
          <li><strong>🇦🇺 Australia:</strong> Call <strong>13 11 14</strong> (Lifeline)</li>
        </ul>
        <p style="margin-top: 15px; font-weight: bold;">🚨 If there is <strong>immediate danger</strong>, please call emergency services: 911</p>
      </div>
      
      <p style="background: #fff3cd; padding: 15px; border-radius: 5px;">
        <strong>Note:</strong> This is an automated alert from MindBloom. The user's safety is the priority. Please act quickly.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 15px 0;">© 2026 MindBloom. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

function buildHighStressEmail(data) {
  const { emergency_contact_name, user_name, entry_text } = data;

  return {
    subject: `Alert: ${user_name} is experiencing high emotional distress`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 0; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .alert-box { background: #fff3cd; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; }
    .entry-preview { background: #f0f0f0; padding: 15px; border-left: 3px solid #999; margin: 15px 0; font-style: italic; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ MindBloom Stress Alert</h1>
    </div>
    
    <div class="content">
      <p>Hi <strong>${emergency_contact_name || "there"}</strong>,</p>
      
      <p><strong>${user_name}</strong> has shared content in MindBloom indicating they are experiencing significant emotional distress.</p>
      
      <div class="alert-box">
        <h3 style="margin-top: 0;">What They Wrote:</h3>
        <div class="entry-preview">
          ${entry_text.substring(0, 300).replace(/\n/g, "<br />")}${entry_text.length > 300 ? "..." : ""}
        </div>
      </div>
      
      <p><strong>Please consider reaching out to them to check in and offer support.</strong></p>
      
      <p>Sometimes just knowing someone cares can make a real difference. A simple message like "I'm thinking of you" or "How can I help?" can go a long way.</p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 15px 0;">© 2026 MindBloom. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}