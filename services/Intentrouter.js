const WHATSAPP_LINK =
  "https://wa.me/917045263033?text=Hi,%20I%20need%20Human%20Support%20with%20MasterTrader";

const HUMAN_SUPPORT_RESPONSE =
  "I completely understand. I am connecting you to our Human Support team " +
  "right away so they can assist you further.\n\n" +
  "You can reach our human support directly via WhatsApp by clicking this link:\n\n" +
  `[Connect with Human Support](${WHATSAPP_LINK})\n\n` +
  "A support representative will be with you shortly to help resolve your issue.";

const IDENTITY_RESPONSE =
  "I'm MasterTrader AI, your virtual assistant for this trading platform. " +
  "I can help you with your account, trades, positions, P&L, deposits, " +
  "payouts, market information and trading rules. What would you like help " +
  "with today?";

// Keep patterns broad but intentional — false negatives (missing a match,
// falling through to the LLM) are safer than false positives here, since a
// mismatch just means the model handles it normally as before.
const HUMAN_SUPPORT_PATTERNS = [
  /\bhuman\b/i,
  /\bagent\b/i,
  /\brepresentative\b/i,
  /\bmanager\b/i,
  /\bcustomer\s*care\b/i,
  /\bcomplain(t)?\b/i,
  /\breal\s*person\b/i,
  /\btalk\s*to\s*(someone|somebody)\b/i,
  /\bspeak\s*(to|with)\s*(a\s*)?(human|agent|person|representative|someone)\b/i,
  /\bconnect\s*me\s*(to|with)\b/i,
  /insaan\s*se\s*baat/i,
  /shikayat/i,
  /\bgussa\b/i,
  /bakwas/i,
  /bad\s*service/i,
  /worst\s*service/i,
  /service\s*is\s*bad/i,
  /\bi\s*am\s*angry\b/i,
];

const IDENTITY_PATTERNS = [
  /\bwho\s*are\s*you\b/i,
  /tum\s*kaun\s*ho/i,
  /aap\s*kaun\s*ho/i,
  /\bgemini\b/i,
  /\bchat\s*gpt\b/i,
  /\bopen\s*ai\b/i,
  /\bgpt-?\d*\b/i,
  /\bclaude\b/i,
  /\banthropic\b/i,
  /\bwhich\s*ai\b/i,
  /\bwhat\s*ai\b/i,
  /\bare\s*you\s*(a\s*)?(bot|ai|robot|human)\b/i,
  /\bignore\s*(your|previous|all)?\s*instructions\b/i,
  /\bsystem\s*prompt\b/i,
  /\bwho\s*(made|built|created)\s*you\b/i,
];

/**
 * @param {string} userMessage - the latest raw message text from the user
 * @returns {string|null} - the fixed response to send immediately, or null
 *                          if no critical intent matched (caller should then
 *                          proceed to call the LLM as normal).
 */
function matchIntent(userMessage) {
  if (!userMessage || typeof userMessage !== "string") return null;

  if (IDENTITY_PATTERNS.some((p) => p.test(userMessage))) {
    return IDENTITY_RESPONSE;
  }

  if (HUMAN_SUPPORT_PATTERNS.some((p) => p.test(userMessage))) {
    return HUMAN_SUPPORT_RESPONSE;
  }

  return null;
}

module.exports = {
  matchIntent,
  HUMAN_SUPPORT_RESPONSE,
  IDENTITY_RESPONSE,
  WHATSAPP_LINK,
};
