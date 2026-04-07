import express from "express";
import Joi from "joi";
import { askGemini, parseGeminiJSON } from "../services/gemini.js";

const router = express.Router();

const schema = Joi.object({
  salary:          Joi.number().min(0).max(100000000).required(),
  otherIncome:     Joi.number().min(0).default(0),
  totalDebt:       Joi.number().min(0).required(),
  monthlyEMI:      Joi.number().min(0).required(),
  interestRate:    Joi.number().min(0).max(50).required(),
  debtType:        Joi.string().valid("home_loan","car_loan","personal_loan","credit_card","education_loan","multiple").required(),
  creditScore:     Joi.number().min(300).max(900).default(700),
  monthlyExpenses: Joi.number().min(0).required(),
  savingsGoal:     Joi.number().min(0).default(0),
  age:             Joi.number().min(18).max(70).default(30),
  dependents:      Joi.number().min(0).max(10).default(0),
});

router.post("/analyze", async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      salary, otherIncome, totalDebt, monthlyEMI,
      interestRate, debtType, creditScore,
      monthlyExpenses, savingsGoal, age, dependents,
    } = value;

    const totalIncome = salary + otherIncome;
    const debtToIncome = ((monthlyEMI / totalIncome) * 100).toFixed(1);
    const disposable = totalIncome - monthlyExpenses - monthlyEMI;

    const prompt = `
You are an expert Indian financial advisor. Analyze this debt situation and return a JSON response ONLY (no markdown, no explanation outside JSON).

USER FINANCIAL PROFILE:
- Monthly Salary: ₹${salary.toLocaleString("en-IN")}
- Other Income: ₹${otherIncome.toLocaleString("en-IN")}
- Total Monthly Income: ₹${totalIncome.toLocaleString("en-IN")}
- Total Debt: ₹${totalDebt.toLocaleString("en-IN")}
- Current Monthly EMI: ₹${monthlyEMI.toLocaleString("en-IN")}
- Interest Rate: ${interestRate}%
- Debt Type: ${debtType}
- Credit Score: ${creditScore}
- Monthly Expenses: ₹${monthlyExpenses.toLocaleString("en-IN")}
- Disposable Income: ₹${disposable.toLocaleString("en-IN")}
- Debt-to-Income Ratio: ${debtToIncome}%
- Age: ${age}
- Dependents: ${dependents}
- Monthly Savings Goal: ₹${savingsGoal.toLocaleString("en-IN")}

Return this exact JSON structure:
{
  "healthScore": <0-100 number>,
  "healthLabel": "<Critical|Poor|Fair|Good|Excellent>",
  "summary": "<2-sentence plain English summary>",
  "debtFreeMonths": <number>,
  "totalInterestPayable": <number>,
  "monthlySavingsPossible": <number>,
  "strategies": [
    {
      "id": "avalanche",
      "name": "Debt Avalanche",
      "description": "<2 sentences>",
      "monthsToPayoff": <number>,
      "interestSaved": <number>,
      "steps": ["<step1>", "<step2>", "<step3>", "<step4>"],
      "recommended": <true|false>
    },
    {
      "id": "snowball",
      "name": "Debt Snowball",
      "description": "<2 sentences>",
      "monthsToPayoff": <number>,
      "interestSaved": <number>,
      "steps": ["<step1>", "<step2>", "<step3>", "<step4>"],
      "recommended": <true|false>
    },
    {
      "id": "consolidation",
      "name": "Debt Consolidation",
      "description": "<2 sentences>",
      "monthsToPayoff": <number>,
      "interestSaved": <number>,
      "steps": ["<step1>", "<step2>", "<step3>", "<step4>"],
      "recommended": <true|false>
    }
  ],
  "indianProducts": [
    {"name": "<product>", "benefit": "<benefit>", "eligibility": "<who qualifies>"}
  ],
  "quickWins": ["<action1>", "<action2>", "<action3>", "<action4>"],
  "warnings": ["<warning if any, else empty array>"],
  "monthlyBudget": {
    "essentials": <number>,
    "emi": <number>,
    "savings": <number>,
    "discretionary": <number>
  },
  "projections": [
    {"month": 0, "debt": ${totalDebt}},
    {"month": 6, "debt": <number>},
    {"month": 12, "debt": <number>},
    {"month": 18, "debt": <number>},
    {"month": 24, "debt": <number>},
    {"month": 30, "debt": <number>},
    {"month": <debtFreeMonths>, "debt": 0}
  ]
}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw);

    if (!data) {
      return res.status(502).json({ error: "AI response parse error. Please retry." });
    }

    res.json({
      ...data,
      inputs: { salary, otherIncome, totalDebt, monthlyEMI, interestRate, debtType, creditScore, monthlyExpenses, debtToIncome: parseFloat(debtToIncome), disposable, totalIncome },
    });
  } catch (err) {
    console.error("[LOAN]", err.message);
    res.status(500).json({ error: "Analysis failed. Please check your Gemini API key." });
  }
});

export default router;
