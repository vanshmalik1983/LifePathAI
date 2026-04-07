import express from "express";
import Joi from "joi";
import { askGemini, parseGeminiJSON } from "../services/gemini.js";

const router = express.Router();

router.post("/plan", async (req, res) => {
  try {
    const { monthlyIncome, monthlyExpenses, savings, investments, age, goals, riskProfile } = req.body;

    const prompt = `
You are an expert Indian financial planner. Return ONLY valid JSON, no markdown.

PROFILE:
- Monthly Income: ₹${monthlyIncome}
- Monthly Expenses: ₹${monthlyExpenses}
- Current Savings: ₹${savings}
- Current Investments: ₹${investments || 0}
- Age: ${age}
- Risk Profile: ${riskProfile || "moderate"}
- Goals: ${JSON.stringify(goals || [])}

Return:
{
  "financialScore": <0-100>,
  "netWorthProjection": [
    {"year": 0, "netWorth": ${savings}},
    {"year": 1, "netWorth": <n>},
    {"year": 3, "netWorth": <n>},
    {"year": 5, "netWorth": <n>},
    {"year": 10, "netWorth": <n>}
  ],
  "savingsRate": <percent>,
  "recommendedBudget": {
    "needs": <percent>,
    "wants": <percent>,
    "savings": <percent>,
    "investments": <percent>
  },
  "investmentPlan": [
    {"instrument":"<name>","allocation":"<percent>%","expectedReturn":"<X%>","reason":"<why>","indianOption":"<specific fund/scheme>"}
  ],
  "taxSavingTips": [
    {"section":"<80C etc>","instrument":"<name>","maxDeduction":"₹<amount>","action":"<what to do>"}
  ],
  "emergencyFund": {"target": <amount>, "current": ${savings}, "monthsToAchieve": <n>},
  "insights": ["<insight1>","<insight2>","<insight3>"],
  "warnings": ["<warning or empty>"]
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
