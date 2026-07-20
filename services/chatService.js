const openai = require("./openaiClient");
const systemPrompt = require("../prompts/systemPrompt");

async function generateResponse(messages) {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
  });

  return response.output_text;
}

module.exports = {
  generateResponse,
};