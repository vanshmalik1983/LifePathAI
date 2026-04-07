import express from "express";
import { askGemini, parseGeminiJSON } from "../services/gemini.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { profile, loanData, careerData, financeData } = req.body;

    const prompt = `
You are LifePath AI. Generate a comprehensive life plan report summary. Return ONLY JSON.

DATA:
${JSON.stringify({ profile, loanData, careerData, financeData }, null, 2)}

Return:
{
  "overallScore": <0-100>,
  "executiveSummary": "<3-4 sentence summary>",
  "keyStrengths": ["<s1>","<s2>","<s3>"],
  "criticalActions": [{"priority":<1-5>,"action":"<action>","impact":"<impact>","timeline":"<when>"}],
  "fiveYearOutlook": "<2-3 sentence vision>",
  "netWorthProjection5yr": <number>,
  "debtFreeDate": "<Month Year>",
  "careerGrowthPct": <number>,
  "sections": {
    "career": {"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},
    "finance": {"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},
    "debt": {"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},
    "goals": {"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"}
  }
}`;

    let raw, data;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      raw = await askGemini(prompt, "", false);
      data = parseGeminiJSON(raw);

      if (data) break;
      console.warn(`[REPORT] JSON parse failed, retrying attempt ${attempt}`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }

    if (!data) {
      console.error("[REPORT] AI returned invalid JSON after retries:", raw?.slice(0, 300));
      return res.status(502).json({ error: "AI returned invalid JSON. Please try again." });
    }

    res.json(data);

  } catch (err) {
    console.error("[REPORT ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;