const axios = require("axios");
require("dotenv").config();

const sendWhatsAppOTP = async (phone, otp) => {
  try {
    const apiUrl = "https://dash.teleobi.com/api/v1/whatsapp/send/template";

    const payload = new URLSearchParams({
      apiToken: process.env.TELEOBI_API_TOKEN,
      phone_number_id: process.env.TELEOBO_NUMBER_ID,
      template_id: "212917",
      phone_number: phone,
      "templateVariable-OTP-1": otp,
    });

    const response = await axios.post(apiUrl, payload.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("📨 TELEOBI RESPONSE:", response.data);

    // Teleobi success checks
    if (
      response.data.status === "success" ||
      response.data.status === true ||
      response.data.message?.includes("success")
    ) {
      return { success: true, message: "OTP Sent." };
    }

    return {
      success: false,
      error: "Teleobi responded with failure.",
      details: response.data,
    };
  } catch (error) {
    console.error(
      "❌ Teleobi OTP Error:",
      error.response?.data || error.message
    );
    return { success: false, error: error.message };
  }
};

module.exports = sendWhatsAppOTP;
