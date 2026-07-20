const { createStream } = require("../services/streamService");

exports.stream = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({
        success: false,
        message: "Messages are required",
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await createStream(messages);

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(event.delta);
      }
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.end();
  }
};