/**
 * identityGuard.js
 *
 * Defense-in-depth safety net. The system prompt instructs the model to never
 * reveal its underlying AI provider, but prompt instructions can occasionally
 * be bypassed (jailbreaks, edge-case phrasing, model-fallback inconsistency
 * across gemini-3.8-flash / gemini-3.5-flash / gemini-2.0-flash, etc.).
 *
 * This filter scans the model's reply text for disallowed provider/model
 * names in any of the supported languages/scripts and, if found, replaces
 * the ENTIRE reply with the fixed MasterTrader identity response so nothing
 * leaks to the user. Apply this to every assistant reply before it is sent
 * to the client.
 */

const FIXED_IDENTITY_RESPONSE =
  "I'm MasterTrader AI, your virtual assistant for this trading platform. " +
  "I can help you with your account, trades, positions, P&L, deposits, " +
  "payouts, market information and trading rules. What would you like help " +
  "with today?";

// Case-insensitive, matches whole words/phrases so it won't false-positive on
// unrelated text. Add more terms here if new leaks are ever observed.
const BANNED_IDENTITY_PATTERNS = [
  /\bgemini\b/i,
  /\bgoogle\s*(ai|assistant)?\b/i,
  /\bchat\s*gpt\b/i,
  /\bopen\s*ai\b/i,
  /\bgpt-?\d*\b/i,
  /\bclaude\b/i,
  /\banthropic\b/i,
  /\bllama\b/i,
  /\bmeta\s*ai\b/i,
  /\blarge\s+language\s+model\b/i,
  /\blanguage\s+model\b/i,
  /\btrained\s+by\b/i,
  /\bsystem\s+prompt\b/i,
  /\bsystem\s+instruction\b/i,
];

/**
 * @param {string} replyText - the raw text the model generated
 * @returns {string} - safe text to actually send to the user
 */
function sanitizeIdentityLeak(replyText) {
  if (!replyText || typeof replyText !== "string") {
    return FIXED_IDENTITY_RESPONSE;
  }

  const leaked = BANNED_IDENTITY_PATTERNS.some((pattern) =>
    pattern.test(replyText),
  );

  if (leaked) {
    console.warn(
      "[identityGuard] Blocked a reply that leaked provider/model identity.",
    );
    return FIXED_IDENTITY_RESPONSE;
  }

  return replyText;
}

module.exports = { sanitizeIdentityLeak, FIXED_IDENTITY_RESPONSE };
