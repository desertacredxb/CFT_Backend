const axios = require("axios");
require("dotenv").config();

/**
 * Send account ID and password via WhatsApp
 */
async function sendWhatsAppAccountDetails(phone, accountId, password) {
  try {
    const apiUrl = "https://dash.teleobi.com/api/v1/whatsapp/send/message";

    const payload = {
      apiToken: process.env.TELEOBI_API_TOKEN,
      phone_number_id: process.env.TELEOBO_NUMBER_ID,
      phone_number: phone,
      message: `🎉 *Your Trading Account is Ready!*\n\n🆔 *Account ID:* ${accountId}\n🔐 *Password:* ${password}\n\nWelcome to Close Friends Traders 🚀`,
    };

    const response = await axios.post(apiUrl, payload);
    console.log("📩 WhatsApp Credentials Sent:", response.data);
  } catch (err) {
    console.error(
      "❌ Failed to send account details via WhatsApp:",
      err.response?.data || err.message
    );
  }
}

module.exports = sendWhatsAppAccountDetails;
