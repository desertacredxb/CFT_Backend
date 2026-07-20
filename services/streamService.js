const openai = require("./openaiClient");
const systemPrompt = require("../prompts/systemPrompt");

async function createStream(messages) {
  return await openai.responses.create({
    model: process.env.OPENAI_MODEL,

    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],

    stream: true,
  });
}

module.exports = {
  createStream,
};