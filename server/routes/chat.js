import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {
  try {
    const { messages, model = "gpt-4o-mini", temperature = 0.8, max_tokens = 200 } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array." });
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });

    res.json(completion);
  } catch (error) {
    console.error("[chat] OpenAI error:", error);
    const status = error?.status ?? 500;
    res.status(status).json({ error: error?.message || "OpenAI request failed." });
  }
});

export default router;


