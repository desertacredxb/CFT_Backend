const { GoogleGenAI } = require("@google/genai");
const { MASTERTRADER_SYSTEM_PROMPT } = require("../prompts/systemPrompt");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Models matching your AI Studio workspace
const MODEL_PRIORITY = [
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

const accountTools = [
  {
    name: "getUserAccountSummary",
    description:
      "Fetches user account details including live balance, margin, used margin, and M2M",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: {
          type: "STRING",
          description: "The ID of the requesting user",
        },
      },
      required: ["userId"],
    },
  },
  {
    name: "getUserPositions",
    description:
      "Fetches user open positions with current P&L, entry prices, and stock details",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: {
          type: "STRING",
          description: "The ID of the requesting user",
        },
      },
      required: ["userId"],
    },
  },
];

async function generateChatResponse(history, userData = {}) {
  const contextualSystemInstruction = `${MASTERTRADER_SYSTEM_PROMPT}

Current Authenticated User Context:
- User Logged In: ${userData.userId ? "YES" : "NO"}
- User ID: ${userData.userId || "GUEST"}
- Live Account Data: ${JSON.stringify(userData)}
`;

  let lastError = null;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: history,
        config: {
          systemInstruction: contextualSystemInstruction,
          temperature: 0.3,
          tools: [{ functionDeclarations: accountTools }],
        },
      });

      return response;
    } catch (error) {
      lastError = error;
      if (
        error?.status === 503 ||
        error?.status === 429 ||
        error?.status === 404
      ) {
        console.warn(
          `[Gemini Failover] ${modelName} returned status ${error?.status}. Trying next model...`,
        );
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

module.exports = {
  generateChatResponse,
};
