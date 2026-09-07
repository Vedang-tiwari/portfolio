import fs from "fs";
import path from "path";

const REGISTRATIONS_PATH = path.resolve(process.cwd(), "data", "registrations.json");
const OWNER_EMAIL = "vedangt027@gmail.com";

// Disposable domains blacklist
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "dispostable.com",
  "getnada.com",
  "sharklasers.com",
  "throwawaymail.com",
  "fake.com",
  "test.com",
  "example.com",
  "asdf.com",
  "123.com",
]);

function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || !domain.includes(".")) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  if (/^(test|fake|asdf|qwerty|admin|user|abcd|1234)$/i.test(local)) return false;
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, email, purpose } = payload || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Please enter your name (at least 2 characters)." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: "Please enter a valid, real email address. Disposable or test emails are not accepted.",
      });
    }

    const registrationEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      purpose: (purpose || "").trim(),
      registeredAt: new Date().toISOString(),
    };

    // 1. Log registration in data/registrations.json
    try {
      const dataDir = path.dirname(REGISTRATIONS_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let currentRegistrations = [];
      if (fs.existsSync(REGISTRATIONS_PATH)) {
        try {
          const raw = fs.readFileSync(REGISTRATIONS_PATH, "utf-8");
          currentRegistrations = JSON.parse(raw);
          if (!Array.isArray(currentRegistrations)) currentRegistrations = [];
        } catch {
          currentRegistrations = [];
        }
      }
      currentRegistrations.unshift(registrationEntry);
      fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify(currentRegistrations, null, 2), "utf-8");
    } catch (fsError) {
      console.error("[Registrations Save Error]", fsError);
    }

    // 2. Dispatch owner email notification
    await dispatchOwnerNotification(registrationEntry);

    return res.status(200).json({ success: true, entry: registrationEntry });
  } catch (err) {
    console.error("[Register CV Error]", err);
    return res.status(500).json({ error: "Server error processing registration." });
  }
}

async function dispatchOwnerNotification(entry) {
  const subject = `📄 CV Unlocked: ${entry.email} has viewed your CV`;
  const textBody = `Hello Vedang,

This email address has registered to view and download your CV:

• Email Address: ${entry.email}
• Full Name: ${entry.name}
• Purpose / Interest: ${entry.purpose || "(None provided)"}
• Timestamp: ${new Date(entry.registeredAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)

---
This notification was automatically sent to ${OWNER_EMAIL} when the visitor unlocked your CV.`;

  // Standard Resend integration if RESEND_API_KEY is present
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [OWNER_EMAIL],
          subject,
          text: textBody,
        }),
      });
      if (response.ok) {
        console.log(`[Email Dispatched via Resend to ${OWNER_EMAIL}]`);
        return;
      }
    } catch (e) {
      console.error("[Resend Email Error]", e);
    }
  }

  // Webhook integration if NOTIFICATION_WEBHOOK_URL is present
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📄 **CV View Alert**: Visitor \`${entry.email}\` (${entry.name}) registered to view your CV!`,
          text: textBody,
        }),
      });
      console.log(`[Notification Dispatched via Webhook]`);
    } catch (e) {
      console.error("[Webhook Error]", e);
    }
  }

  // Dev & Fallback Log Notification
  console.log("\n=======================================================");
  console.log(`📧 [OWNER EMAIL NOTIFICATION DISPATCHED -> ${OWNER_EMAIL}]`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${textBody}`);
  console.log("=======================================================\n");
}
