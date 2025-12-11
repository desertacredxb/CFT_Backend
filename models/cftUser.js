const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    email: { type: String }, // optional if you want
    password: { type: String, required: true },

    accountId: { type: String }, // Returned from client API
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cftUser", userSchema);
