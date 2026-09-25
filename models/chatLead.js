const mongoose = require("mongoose");

const chatLeadSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "GUEST" },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, default: "" },
    interest: {
      type: String,
      enum: ["Forex", "COMEX", "Both"],
      required: true,
    },
    preferredContactTime: { type: String, default: "Anytime" },
    existingClient: { type: Boolean, default: false },
    originalQuestion: { type: String, required: true },
    source: { type: String, default: "MasterTrader AI" },
    consent: { type: Boolean, required: true, default: true },
    language: { type: String, default: "English" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("chatLead", chatLeadSchema);
