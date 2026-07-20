const { generateResponse } = require("../services/chatService");

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({
        success: false,
        message: "Messages are required",
      });
    }

    const answer = await generateResponse(messages);

    res.json({
      success: true,
      response: answer,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};