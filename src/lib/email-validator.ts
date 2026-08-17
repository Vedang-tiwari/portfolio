/**
 * Robust email validator & disposable domain blacklist filter.
 * Prevents registration with fake, disposable, or made-up email addresses.
 */

// Top disposable & temporary email domains to block
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.me",
  "dispostable.com",
  "getnada.com",
  "sharklasers.com",
  "throwawaymail.com",
  "maildrop.cc",
  "crazymailing.com",
  "inboxalias.com",
  "tmail.ws",
  "mytemp.email",
  "generator.email",
  "emailondeck.com",
  "tempinbox.com",
  "tempmailaddress.com",
  "mohmal.com",
  "boun.cr",
  "burnermail.io",
  "10minutemail.net",
  "minutemail.com",
  "disposable.com",
  "disposableaddress.com",
  "fakeinbox.com",
  "fakeinbox.net",
  "mailnesia.com",
  "mailcatch.com",
  "spambox.us",
  "fakemailgenerator.com",
  "disposablemail.com",
  "mailnull.com",
  "spamgourmet.com",
  "meltmail.com",
  "dropmail.me",
]);

// Known dummy / placeholder domains to block
const DUMMY_DOMAINS = new Set([
  "test.com",
  "test.org",
  "test.net",
  "fake.com",
  "fake.org",
  "example.com",
  "example.org",
  "example.net",
  "asdf.com",
  "qwerty.com",
  "xyz.com",
  "abc.com",
  "123.com",
  "a.com",
  "b.com",
  "c.com",
  "foo.com",
  "bar.com",
  "dummy.com",
  "invalid.com",
]);

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateRealEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, reason: "Email address cannot be empty." };
  }

  if (trimmed.length > 254) {
    return { valid: false, reason: "Email address is too long." };
  }

  // Basic RFC 5322 regex format check
  const emailRegex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[\x00-\x04]\d)|1\d{2}|[1-9]?\d))\send\.){3}(?:(2(5[0-5]|[\x00-\x04]\d)|1\d{2}|[1-9]?\d)|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: "Please enter a valid email address format (e.g. name@domain.com)." };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return { valid: false, reason: "Invalid email structure." };
  }

  const [localPart, domainPart] = parts;

  // Local part checks
  if (localPart.length === 0 || localPart.length > 64) {
    return { valid: false, reason: "Invalid username portion of email." };
  }

  if (/^(test|fake|asdf|qwerty|admin|user|abcd|1234|noone|none|xyz)$/i.test(localPart)) {
    return { valid: false, reason: "Please provide a real email address instead of a placeholder username." };
  }

  // Domain checks
  if (!domainPart || !domainPart.includes(".")) {
    return { valid: false, reason: "Email domain must include a valid top-level domain (e.g. .com, .edu, .org)." };
  }

  const domainLabels = domainPart.split(".");
  const tld = domainLabels[domainLabels.length - 1];

  if (!tld || tld.length < 2) {
    return { valid: false, reason: "Invalid domain extension." };
  }

  if (DISPOSABLE_DOMAINS.has(domainPart)) {
    return { valid: false, reason: "Disposable or temporary email services (like tempmail/mailinator) are not permitted." };
  }

  if (DUMMY_DOMAINS.has(domainPart)) {
    return { valid: false, reason: "Please enter your real email address instead of a dummy or test domain." };
  }

  return { valid: true };
}
