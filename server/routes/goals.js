import express from "express";
import { askGemini, parseGeminiJSON } from "../services/gemini.js";

const router = express.Router();

router.post("/plan", async (req, res) => {
  try {
    const { goals, income, savings, age } = req.body;

    const prompt = `
You are an Indian financial goal planner. Return ONLY JSON, no markdown.

USER:
- Monthly Income: ₹${income}
- Current Savings: ₹${savings}
- Age: ${age}
- Goals: ${JSON.stringify(goals)}

Return:
{
  "goals": [
    {
      "name": "<goal name>",
      "targetAmount": <number>,
      "timelineMonths": <number>,
      "monthlyRequired": <number>,
      "feasibility": "<Easy|Moderate|Challenging|Difficult>",
      "strategy": "<2-sentence strategy>",
      "indianInstrument": "<best Indian financial product to use>",
      "milestones": [{"month": <n>, "amount": <n>, "action": "<action>"}]
    }
  ],
  "priorityOrder": ["<goal1>","<goal2>","<goal3>"],
  "totalMonthlyRequired": <number>,
  "feasibilityScore": <0-100>,
  "advice": "<Overall 2-sentence advice>"
}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw);
    if (!data) return res.status(502).json({ error: "Parse error." });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
