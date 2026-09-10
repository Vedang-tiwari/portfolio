import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const REGISTRATIONS_PATH = path.resolve(process.cwd(), "data", "registrations.json");
const OWNER_EMAIL = "vedangt027@gmail.com";

// In-memory OTP storage map (stores { code, name, purpose, expiresAt })
const otpStore = globalThis._otpStore || new Map();
if (!globalThis._otpStore) {
  globalThis._otpStore = otpStore;
}

// Disposable & dummy domains blacklist
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
  "xyz.com",
  "abc.com",
  "dummy.com",
  "invalid.com",
]);

function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || !domain.includes(".")) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  if (/^(test|fake|asdf|qwerty|admin|user|abcd|1234|noone|none|xyz)$/i.test(local)) return false;

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;

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
    const { action = "send-otp", name, email, purpose, otp } = payload || {};

    const normalizedEmail = (email || "").trim().toLowerCase();

    // ACTION: Notify owner on CV Download
    if (action === "notify-download") {
      if (normalizedEmail) {
        await dispatchDownloadNotification({ email: normalizedEmail, name: name || "Verified Visitor" });
      }
      return res.status(200).json({ success: true });
    }

    // ACTION: Verify OTP code
    if (action === "verify-otp") {
      if (!normalizedEmail || !validateEmail(normalizedEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      const inputOtp = (otp || "").toString().trim();
      if (!inputOtp || inputOtp.length !== 6) {
        return res.status(400).json({ error: "Please enter a valid 6-digit verification code." });
      }

      const record = otpStore.get(normalizedEmail);
      if (!record) {
        return res.status(400).json({
          error: "No pending verification found for this email. Please click 'Resend Code'.",
        });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({
          error: "Verification code has expired. Please request a new code.",
        });
      }

      if (record.code !== inputOtp) {
        return res.status(400).json({
          error: "Incorrect verification code. Please check your email inbox and try again.",
        });
      }

      // OTP is valid!
      const registrationEntry = {
        name: record.name,
        email: normalizedEmail,
        purpose: record.purpose,
        registeredAt: new Date().toISOString(),
        verified: true,
      };

      // Clean up OTP record
      otpStore.delete(normalizedEmail);

      // Save registration to disk
      saveRegistrationToDisk(registrationEntry);

      // Dispatch notification email to owner (vedangt027@gmail.com)
      await dispatchOwnerNotification(registrationEntry);

      return res.status(200).json({
        success: true,
        verified: true,
        entry: registrationEntry,
      });
    }

    // DEFAULT ACTION: Send OTP to visitor's email
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Please enter your name (at least 2 characters)." });
    }

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        error: "Please enter a valid, real email address. Disposable or made-up test emails are not accepted.",
      });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalizedEmail, {
      code,
      name: name.trim(),
      purpose: (purpose || "").trim(),
      expiresAt,
    });

    // Dispatch OTP email to visitor
    const visitorSubject = `Your CV Unlock Verification Code: ${code}`;
    const visitorBody = `Hello ${name.trim()},\n\nYour 6-digit email verification code to access and download Vedang Tiwari's CV is:\n\n👉  ${code}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this message.\n\nBest regards,\nVedang Tiwari`;

    const sent = await sendEmail({
      to: normalizedEmail,
      subject: visitorSubject,
      text: visitorBody,
    });

    if (!sent && !process.env.RESEND_API_KEY && !process.env.GMAIL_APP_PASSWORD && !process.env.SMTP_HOST) {
      console.warn("[WARN] Email credentials not configured in environment variables.");
    }

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Please check your email inbox.`,
    });
  } catch (err) {
    console.error("[Register CV Error]", err);
    return res.status(500).json({ error: "Server error processing verification request." });
  }
}

function saveRegistrationToDisk(registrationEntry) {
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
}

async function dispatchOwnerNotification(entry) {
  const subject = `📄 New Visitor CV Unlock Alert: ${entry.name} (${entry.email})`;
  const textBody = `Hello Vedang,

Great news! A visitor has verified their email address and unlocked access to your CV!

• Full Name: ${entry.name}
• Verified Email: ${entry.email}
• Purpose / Interest: ${entry.purpose || "(None provided)"}
• Verification Status: Verified via 6-Digit Email OTP
• Timestamp: ${new Date(entry.registeredAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)

---
This email notification was automatically sent to ${OWNER_EMAIL} when the visitor unlocked your CV.`;

  await sendEmail({
    to: OWNER_EMAIL,
    subject,
    text: textBody,
  });
}

async function dispatchDownloadNotification({ email, name }) {
  const subject = `📥 CV File Download Alert: ${name} (${email})`;
  const textBody = `Hello Vedang,

The verified visitor ${name} (${email}) has just clicked the download button and downloaded your CV PDF!

• Visitor Name: ${name}
• Verified Email: ${email}
• Timestamp: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)

---
Notification sent to ${OWNER_EMAIL}.`;

  await sendEmail({
    to: OWNER_EMAIL,
    subject,
    text: textBody,
  });
}

async function sendEmail({ to, subject, text }) {
  let sent = false;

  // Method 1: Gmail SMTP / Nodemailer (if GMAIL_USER & GMAIL_APP_PASSWORD or SMTP_HOST are set)
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Vedang Tiwari Portfolio" <${gmailUser}>`,
        to: Array.isArray(to) ? to.join(",") : to,
        subject,
        text,
      });

      console.log(`[Email Sent via SMTP/Gmail to ${to}]`);
      return true;
    } catch (e) {
      console.error("[Nodemailer SMTP Error]", e);
    }
  }

  // Method 2: Resend API (if RESEND_API_KEY is set)
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
          from: "Vedang Tiwari Portfolio <onboarding@resend.dev>",
          to: Array.isArray(to) ? to : [to],
          subject,
          text,
        }),
      });
      if (response.ok) {
        console.log(`[Email Dispatched via Resend to ${to}]`);
        sent = true;
      } else {
        const errText = await response.text();
        console.error(`[Resend Error ${response.status}]`, errText);
      }
    } catch (e) {
      console.error("[Resend Fetch Error]", e);
    }
  }

  // Method 3: Webhook (if NOTIFICATION_WEBHOOK_URL is set)
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          text,
          content: `📄 **Email Sent to ${to}**: ${subject}\n${text}`,
        }),
      });
      console.log(`[Notification Dispatched via Webhook]`);
      sent = true;
    } catch (e) {
      console.error("[Webhook Error]", e);
    }
  }

  console.log("\n=======================================================");
  console.log(`📧 [EMAIL DISPATCH LOG] -> To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${text}`);
  console.log("=======================================================\n");

  return sent;
}


