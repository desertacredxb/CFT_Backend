const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String },
  email: { type: String },
  marketSegment: { type: String },
  status: {
    type: String,
    enum: ["new", "connected", "inProcess", "completed", "rejected"],
    default: "new",
  },
  referralcode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("newLead", leadSchema);
