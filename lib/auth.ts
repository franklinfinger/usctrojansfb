export const AUTH_COOKIE_NAME = "site_auth";
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Both arguments here are always fixed-length hex digests (never the raw
// secret), so comparing them byte-by-byte can't leak a caller-supplied
// value's length or content through early-exit timing.
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Constant-time password check: both sides are hashed to a fixed-length
// digest before comparison, so the check's timing never depends on the
// submitted password's length or which characters happen to match.
export async function passwordMatches(submitted: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256Hex(submitted), sha256Hex(expected)]);
  return constantTimeEqual(a, b);
}

// The auth cookie's value is an HMAC of the site password, not the password
// itself and not a static marker — it can only be produced by someone who
// knows SITE_PASSWORD, so it can't be forged by just guessing a cookie name.
export async function createAuthCookieValue(password: string): Promise<string> {
  return hmacSha256Hex(password, "usctrojansfb-site-auth");
}

export async function isValidAuthCookie(
  value: string | undefined,
  password: string
): Promise<boolean> {
  if (!value) return false;
  const expected = await createAuthCookieValue(password);
  return constantTimeEqual(value, expected);
}
