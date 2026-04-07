import express from "express";
import Joi from "joi";
import { askGemini, parseGeminiJSON } from "../services/gemini.js";

const router = express.Router();

const schema = Joi.object({
  currentRole:     Joi.string().max(100).required(),
  currentSalary:   Joi.number().min(0).required(),
  experience:      Joi.number().min(0).max(50).required(),
  skills:          Joi.array().items(Joi.string()).min(1).max(20).required(),
  education:       Joi.string().valid("10th","12th","diploma","btech","mtech","mba","phd","other").required(),
  industry:        Joi.string().max(100).required(),
  location:        Joi.string().max(100).default("India"),
  careerGoal:      Joi.string().max(300).required(),
  workStyle:       Joi.string().valid("office","remote","hybrid").default("hybrid"),
  riskAppetite:    Joi.string().valid("low","medium","high").default("medium"),
  targetSalary:    Joi.number().min(0).default(0),
  timeframe:       Joi.number().min(1).max(10).default(3),
});

router.post("/analyze", async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const prompt = `
You are an expert Indian career coach. Analyze this profile and return ONLY valid JSON (no markdown).

PROFILE:
- Current Role: ${value.currentRole}
- Current Salary: ₹${value.currentSalary.toLocaleString("en-IN")} per annum
- Experience: ${value.experience} years
- Skills: ${value.skills.join(", ")}
- Education: ${value.education}
- Industry: ${value.industry}
- Location: ${value.location}
- Career Goal: ${value.careerGoal}
- Work Style: ${value.workStyle}
- Risk Appetite: ${value.riskAppetite}
- Target Salary: ₹${value.targetSalary.toLocaleString("en-IN")}
- Timeframe: ${value.timeframe} years

Return this exact JSON:
{
  "overallScore": <0-100>,
  "marketability": "<Low|Medium|High|Very High>",
  "summary": "<3-sentence career summary>",
  "topMatches": [
    {
      "title": "<role>",
      "matchPercent": <number>,
      "salaryRange": "<₹X LPA – ₹Y LPA>",
      "growthRate": "<+X% per year>",
      "companies": ["<co1>","<co2>","<co3>"],
      "requiredSkills": ["<skill1>","<skill2>","<skill3>"],
      "missingSkills": ["<skill1>","<skill2>"],
      "timeToTransition": "<X months>",
      "demandLevel": "<Low|Medium|High|Very High>"
    }
  ],
  "skillAnalysis": {
    "strengths": [{"skill":"<name>","score":<0-100>,"marketValue":"<₹ impact>"}],
    "gaps": [{"skill":"<name>","importance":"<High|Medium|Low>","learningTime":"<X weeks>","freeResource":"<URL or platform>"}],
    "trending": ["<skill1>","<skill2>","<skill3>"]
  },
  "roadmap": [
    {"phase": 1, "title":"<title>","duration":"<X months>","actions":["<action1>","<action2>","<action3>"],"milestone":"<outcome>"},
    {"phase": 2, "title":"<title>","duration":"<X months>","actions":["<action1>","<action2>","<action3>"],"milestone":"<outcome>"},
    {"phase": 3, "title":"<title>","duration":"<X months>","actions":["<action1>","<action2>","<action3>"],"milestone":"<outcome>"}
  ],
  "salaryProjection": [
    {"year": 0, "salary": ${value.currentSalary}},
    {"year": 1, "salary": <number>},
    {"year": 2, "salary": <number>},
    {"year": 3, "salary": <number>},
    {"year": 5, "salary": <number>}
  ],
  "freeResources": [
    {"name":"<resource name>","url":"<real URL>","type":"<Course|YouTube|Book|Community>","rating":"<X/5>"}
  ],
  "interviewTips": ["<tip1>","<tip2>","<tip3>","<tip4>","<tip5>"],
  "indianMarketInsights": "<2-3 sentences about the Indian job market for this career path>",
  "redFlags": ["<any concern, or empty array>"]
}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw);
    if (!data) return res.status(502).json({ error: "Parse error. Please retry." });

    res.json({ ...data, inputs: value });
  } catch (err) {
    console.error("[CAREER]", err.message);
    res.status(500).json({ error: "Career analysis failed." });
  }
});

// Quick career tips (lighter call)
router.post("/tips", async (req, res) => {
  try {
    const { role, skill, level } = req.body;
    const prompt = `Give 5 specific, actionable career tips for a ${level || "mid-level"} ${role} with skills in ${skill || "general"} in the Indian job market. Return JSON array of objects: [{"tip":"<tip>","category":"<Resume|Interview|Networking|Upskilling|Salary>","impact":"<High|Medium|Low>"}]`;
    const data = await askGeminiJSON(prompt);
    res.json({ tips: tips || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
