import express from "express";
import { askGemini } from "../services/gemini.js";

const router = express.Router();

const SYSTEM = `You are LifePath AI, a friendly Indian financial advisor and career coach.
- Always use ₹ (Indian Rupees) and Indian context (LPA, crore, lakh)
- Be concise, warm, and actionable
- Reference Indian financial products (SIP, PPF, ELSS, NPS, FD, RD, NSC)
- Reference Indian job market and companies
- Keep responses under 200 words unless asked for detail
- Never give medical advice`;

router.post("/message", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const context = history.slice(-6).map(h => `${h.role}: ${h.content}`).join("\n");
    const fullPrompt = context
      ? `Previous conversation:\n${context}\n\nUser: ${message}`
      : message;

    const response = await askGemini(fullPrompt, SYSTEM, false);
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Chat unavailable. Please retry." });
  }
});

export default router;
