const { generateChatResponse } = require("../services/geminiService");
const chatLead = require("../models/Lead"); // Make sure this matches your filename in models/
const Handoff = require("../models/Handoff");
const { sanitizeIdentityLeak } = require("../services/identityGuard");
const { matchIntent } = require("../services/Intentrouter");

const ALLOWED_ATTACHMENT_MIMES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

// List of intent keywords requiring active login
const PERSONAL_DATA_KEYWORDS = [
  "balance",
  "margin",
  "p&l",
  "pnl",
  "position",
  "positions",
  "trade",
  "trades",
  "last trade",
  "deposit",
  "payout",
  "withdrawal",
  "my orders",
  "ledger",
  "m2m",
];

async function fetchAccountData(functionName, userId, args = {}) {
  const mockDatabase = {
    getUserAccountSummary: {
      ledgerBalance: "₹1,50,000.00",
      availableMargin: "₹1,20,000.00",
      usedMargin: "₹30,000.00",
      m2m: "+₹4,500.00",
    },
    getUserPositions: [
      {
        symbol: "RELIANCE",
        side: "BUY",
        qty: 50,
        entryPrice: 2800,
        currentPrice: 2850,
        pnl: "+₹2,500",
      },
      {
        symbol: "NIFTY24SEP25000CE",
        side: "BUY",
        qty: 100,
        entryPrice: 120,
        currentPrice: 140,
        pnl: "+₹2,000",
      },
    ],
    getUserTradeHistory: [
      {
        symbol: "TATAMOTORS",
        side: "BUY",
        qty: 100,
        price: 980,
        pnl: "+₹1,200",
        dateTime: "2026-09-25 10:15 AM",
      },
      {
        symbol: "INFY",
        side: "SELL",
        qty: 50,
        price: 1850,
        pnl: "-₹400",
        dateTime: "2026-09-24 02:30 PM",
      },
    ],
    getPayoutStatus: {
      amount: "₹10,000",
      status: "PROCESSING",
      requestTime: "2026-09-25 11:00 AM",
      referenceId: "PAY9823411",
    },
  };

  return mockDatabase[functionName] || { info: "No data found for user" };
}

const handleChatMessage = async (req, res) => {
  try {
    // multipart requests arrive with "messages" as a JSON string field
    const messages =
      typeof req.body.messages === "string"
        ? JSON.parse(req.body.messages)
        : req.body.messages;
    const userId = req.body.userId || "GUEST";

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Messages array is required." });
    }

    const latestUserMessage = messages[messages.length - 1]?.text || "";
    const routedResponse = matchIntent(latestUserMessage);
    if (routedResponse) {
      return res.status(200).json({
        success: true,
        data: {
          role: "assistant",
          text: routedResponse,
          createdAt: new Date().toISOString(),
        },
      });
    }

    const rejectedFiles = (req.files || []).filter(
      (f) => !ALLOWED_ATTACHMENT_MIMES.includes(f.mimetype),
    );

    // 2. Check if user is asking for personal account data as a GUEST
    const lastUserMsg =
      messages[messages.length - 1]?.text?.toLowerCase() || "";
    const isAskingAccountData = PERSONAL_DATA_KEYWORDS.some((kw) =>
      lastUserMsg.includes(kw),
    );

    const isGuest = !userId || userId === "GUEST";

    if (isGuest && isAskingAccountData) {
      const isHinglish = /mera|mere|mujhe|btao|karo|dikhao|kya/i.test(
        lastUserMsg,
      );

      const loginPromptText = isHinglish
        ? "Apne account details, balance, open positions, aur trade history check karne ke liye kripya pehle apne MasterTrader account mein log in karein."
        : "To view your account details, last trades, balance, or payout status, please log in to your MasterTrader account first.";

      return res.status(200).json({
        success: true,
        requiresLogin: true, // Frontend flag to trigger a Login Modal if needed
        data: {
          role: "assistant",
          text: loginPromptText,
          createdAt: new Date().toISOString(),
        },
      });
    }

    const formattedHistory = messages.map((msg, idx) => {
      const parts = [];
      if (msg.text) parts.push({ text: msg.text });

      // Only the current (last) message can carry the files just uploaded.
      if (idx === messages.length - 1 && req.files) {
        for (const file of req.files) {
          if (ALLOWED_ATTACHMENT_MIMES.includes(file.mimetype)) {
            parts.push({
              inlineData: {
                mimeType: file.mimetype,
                data: file.buffer.toString("base64"),
              },
            });
          }
        }
      }

      return { role: msg.role === "user" ? "user" : "model", parts };
    });

    let geminiResponse = await generateChatResponse(formattedHistory, {
      userId,
    });
    let functionCalls = geminiResponse.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const toolData = await fetchAccountData(call.name, userId, call.args);
      geminiResponse = await generateChatResponse(formattedHistory, {
        userId,
        fetchedToolData: { tool: call.name, data: toolData },
      });
    }

    const rawReplyText =
      geminiResponse.text || "I am here to assist you with MasterTrader AI.";
    let replyText = sanitizeIdentityLeak(rawReplyText);

    if (rejectedFiles.length > 0) {
      const names = rejectedFiles.map((f) => f.originalname).join(", ");
      replyText += `\n\n(Note: I couldn't process ${names} — only images and PDF files are supported as attachments.)`;
    }

    return res.status(200).json({
      success: true,
      data: {
        role: "assistant",
        text: replyText,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in handleChatMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while processing chat query.",
    });
  }
};

const captureLead = async (req, res) => {
  try {
    const {
      userId,
      name,
      mobile,
      email,
      interest,
      preferredContactTime,
      existingClient,
      originalQuestion,
      language,
    } = req.body;

    if (!name || !mobile || !interest || !originalQuestion) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile, interest, and original question are required.",
      });
    }

    const lead = await chatLead.create({
      userId,
      name,
      mobile,
      email,
      interest,
      preferredContactTime,
      existingClient,
      originalQuestion,
      consent: true,
      language: language || "English",
    });

    return res.status(201).json({
      success: true,
      message:
        "Lead recorded successfully. A representative will reach out shortly.",
      leadId: lead._id,
    });
  } catch (error) {
    console.error("Error capturing lead:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save lead info." });
  }
};

const escalateToHuman = async (req, res) => {
  try {
    const {
      userId,
      userName,
      issueCategory,
      userQuestion,
      conversationSummary,
      transactionId,
      orderId,
      amount,
      reasonForEscalation,
      priority,
      language,
    } = req.body;

    if (!userId || !userQuestion || !reasonForEscalation) {
      return res.status(400).json({
        success: false,
        message: "UserId, userQuestion, and reasonForEscalation are required.",
      });
    }

    const handoff = await Handoff.create({
      userId,
      userName,
      issueCategory: issueCategory || "GENERAL_ESCALATION",
      userQuestion,
      conversationSummary: conversationSummary || userQuestion,
      transactionId,
      orderId,
      amount,
      reasonForEscalation,
      priority: priority || "MEDIUM",
      language: language || "English",
    });

    return res.status(201).json({
      success: true,
      message: "Escalation logged successfully. Human support agent assigned.",
      ticketId: handoff._id,
    });
  } catch (error) {
    console.error("Error logging escalation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log human escalation ticket.",
    });
  }
};

module.exports = {
  handleChatMessage,
  captureLead,
  escalateToHuman,
};
