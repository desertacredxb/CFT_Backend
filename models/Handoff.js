const mongoose = require("mongoose");

const handoffSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, default: "User" },
    issueCategory: {
      type: String,
      enum: [
        "PAYOUT_DELAY",
        "DEPOSIT_ISSUE",
        "ACCOUNT_SECURITY",
        "TRADE_DISPUTE",
        "LOGIN_APP_ERROR",
        "COMPLAINT",
        "GENERAL_ESCALATION",
      ],
      default: "GENERAL_ESCALATION",
    },
    userQuestion: { type: String, required: true },
    conversationSummary: { type: String, required: true },
    transactionId: { type: String, default: null },
    orderId: { type: String, default: null },
    amount: { type: Number, default: null },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    reasonForEscalation: { type: String, required: true },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    language: { type: String, default: "English" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Handoff", handoffSchema);
