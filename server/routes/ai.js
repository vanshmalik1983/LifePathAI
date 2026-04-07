import express from "express";
import { askGemini, parseGeminiJSON } from "../services/gemini.js"; // ✅ corrected
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

// ── LOAN ──────────────────────────────────────────────────
export const loanRouter = express.Router();
loanRouter.post("/analyze", protect, async (req, res) => {
  try {
    const {
      salary = 0,
      otherIncome = 0,
      totalDebt = 0,
      monthlyEMI = 0,
      interestRate = 9.5,
      debtType = "home_loan",
      creditScore = 700,
      monthlyExpenses = 0,
      savingsGoal = 0,
      age = 30,
      dependents = 0
    } = req.body;

    if (!salary || !totalDebt || !monthlyEMI || !monthlyExpenses)
      return res.status(400).json({ error: "salary, totalDebt, monthlyEMI, monthlyExpenses required" });

    const ti = Number(salary) + Number(otherIncome);
    const dti = ((monthlyEMI / ti) * 100).toFixed(1);

    const prompt = `Analyze Indian debt. ONLY valid JSON:\nIncome ₹${ti}, Debt ₹${totalDebt}, EMI ₹${monthlyEMI}, Rate ${interestRate}%, Type ${debtType}, Score ${creditScore}, Expenses ₹${monthlyExpenses}, DTI ${dti}%, Age ${age}\n{"healthScore":<0-100>,"healthLabel":"<Critical|Poor|Fair|Good|Excellent>","summary":"<2 sentences>","debtFreeMonths":<n>,"totalInterestPayable":<n>,"monthlySavingsPossible":<n>,"strategies":[{"id":"avalanche","name":"Debt Avalanche","description":"<2 sentences>","monthsToPayoff":<n>,"interestSaved":<n>,"steps":["<s1>","<s2>","<s3>","<s4>"],"recommended":true},{"id":"snowball","name":"Debt Snowball","description":"<2 sentences>","monthsToPayoff":<n>,"interestSaved":<n>,"steps":["<s1>","<s2>","<s3>","<s4>"],"recommended":false},{"id":"consolidation","name":"Consolidation","description":"<2 sentences>","monthsToPayoff":<n>,"interestSaved":<n>,"steps":["<s1>","<s2>","<s3>","<s4>"],"recommended":false}],"indianProducts":[{"name":"<product>","benefit":"<benefit>","eligibility":"<who>"}],"quickWins":["<a1>","<a2>","<a3>","<a4>"],"warnings":[],"monthlyBudget":{"essentials":<n>,"emi":<n>,"savings":<n>,"discretionary":<n>},"projections":[{"month":0,"debt":${totalDebt}},{"month":6,"debt":<n>},{"month":12,"debt":<n>},{"month":18,"debt":<n>},{"month":24,"debt":<n>}]}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw); // ✅ corrected
    if (!data) return res.status(502).json({ error: "Parse error — please retry" });

    const result = { ...data, inputs: { salary, totalDebt, monthlyEMI, interestRate, debtType, creditScore, monthlyExpenses, debtToIncome: parseFloat(dti), totalIncome: ti } };
    await User.findByIdAndUpdate(req.user._id, { lastLoanAnalysis: result });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CAREER ─────────────────────────────────────────────────
export const careerRouter = express.Router();
careerRouter.post("/analyze", protect, async (req, res) => {
  try {
    const {
      currentRole,
      currentSalary,
      experience,
      skills = [],
      education,
      industry,
      location = "India",
      careerGoal,
      workStyle = "hybrid",
      riskAppetite = "medium",
      targetSalary = 0,
      timeframe = 3
    } = req.body;

    if (!currentRole || !currentSalary || !careerGoal)
      return res.status(400).json({ error: "currentRole, currentSalary, careerGoal required" });

    const sl = Array.isArray(skills) ? skills.join(", ") : skills;

    const prompt = `Career analysis India. ONLY JSON:\nRole ${currentRole}, Salary ₹${currentSalary}/yr, ${experience}yrs, Skills: ${sl}, ${education}, ${industry}, ${location}, Goal: ${careerGoal}, Risk: ${riskAppetite}, Target ₹${targetSalary}, ${timeframe}yrs\n{"overallScore":<0-100>,"marketability":"<High|Very High|Medium|Low>","summary":"<3 sentences>","topMatches":[{"title":"<role>","matchPercent":<n>,"salaryRange":"<₹X LPA – ₹Y LPA>","growthRate":"<+X%/yr>","companies":["<c1>","<c2>","<c3>"],"requiredSkills":["<s1>","<s2>","<s3>"],"missingSkills":["<s1>","<s2>"],"timeToTransition":"<X months>","demandLevel":"<High|Very High|Medium|Low>"}],"skillAnalysis":{"strengths":[{"skill":"<n>","score":<n>,"marketValue":"<₹ impact>"}],"gaps":[{"skill":"<n>","importance":"<High|Medium|Low>","learningTime":"<X weeks>","freeResource":"<platform or url>"}],"trending":["<s1>","<s2>","<s3>"]},"roadmap":[{"phase":1,"title":"<t>","duration":"<X months>","actions":["<a1>","<a2>","<a3>"],"milestone":"<outcome>"},{"phase":2,"title":"<t>","duration":"<X months>","actions":["<a1>","<a2>","<a3>"],"milestone":"<outcome>"},{"phase":3,"title":"<t>","duration":"<X months>","actions":["<a1>","<a2>","<a3>"],"milestone":"<outcome>"}],"salaryProjection":[{"year":0,"salary":${currentSalary}},{"year":1,"salary":<n>},{"year":2,"salary":<n>},{"year":3,"salary":<n>},{"year":5,"salary":<n>}],"freeResources":[{"name":"<n>","url":"<url>","type":"<Course|YouTube|Book>","rating":"<X/5>"}],"interviewTips":["<t1>","<t2>","<t3>","<t4>","<t5>"],"indianMarketInsights":"<2-3 sentences>","redFlags":[]}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw); // ✅ corrected
    if (!data) return res.status(502).json({ error: "Parse error" });

    const result = { ...data, inputs: req.body };
    await User.findByIdAndUpdate(req.user._id, { lastCareerAnalysis: result });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── FINANCE ────────────────────────────────────────────────
export const financeRouter = express.Router();
financeRouter.post("/plan", protect, async (req, res) => {
  try {
    const { monthlyIncome, monthlyExpenses, savings, investments = 0, age = 30, riskProfile = "moderate", goals = [] } = req.body;
    if (!monthlyIncome || !monthlyExpenses) return res.status(400).json({ error: "monthlyIncome and monthlyExpenses required" });

    const prompt = `Indian finance plan. ONLY JSON:\nIncome ₹${monthlyIncome}/mo, Expenses ₹${monthlyExpenses}/mo, Savings ₹${savings}, Investments ₹${investments}, Age ${age}, Risk ${riskProfile}, Goals: ${JSON.stringify(goals)}\n{"financialScore":<0-100>,"netWorthProjection":[{"year":0,"netWorth":${savings||0}},{"year":1,"netWorth":<n>},{"year":3,"netWorth":<n>},{"year":5,"netWorth":<n>},{"year":10,"netWorth":<n>}],"savingsRate":<pct>,"recommendedBudget":{"needs":<pct>,"wants":<pct>,"savings":<pct>,"investments":<pct>},"investmentPlan":[{"instrument":"<n>","allocation":"<X%>","expectedReturn":"<X%>","reason":"<why>","indianOption":"<specific fund>"}],"taxSavingTips":[{"section":"<80C etc>","instrument":"<n>","maxDeduction":"₹<amount>","action":"<what>"}],"emergencyFund":{"target":<n>,"current":${savings||0},"monthsToAchieve":<n>},"insights":["<i1>","<i2>","<i3>"],"warnings":[]}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw); // ✅ corrected
    if (!data) return res.status(502).json({ error: "Parse error" });

    await User.findByIdAndUpdate(req.user._id, { lastFinancePlan: data });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GOALS ──────────────────────────────────────────────────
export const goalsRouter = express.Router();
goalsRouter.post("/plan", protect, async (req, res) => {
  try {
    const { goals = [], income, savings, age = 30 } = req.body;
    const prompt = `Indian goals roadmap. ONLY JSON:\nIncome ₹${income}/mo, Savings ₹${savings}, Age ${age}, Goals: ${JSON.stringify(goals)}\n{"goals":[{"name":"<n>","targetAmount":<n>,"timelineMonths":<n>,"monthlyRequired":<n>,"feasibility":"<Easy|Moderate|Challenging|Difficult>","strategy":"<2 sentences>","indianInstrument":"<best Indian product>","milestones":[{"month":<n>,"amount":<n>,"action":"<action>"}]}],"priorityOrder":["<g1>","<g2>"],"totalMonthlyRequired":<n>,"feasibilityScore":<0-100>,"advice":"<2 sentences>"}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw); // ✅ corrected
    if (!data) return res.status(502).json({ error: "Parse error" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REPORT ─────────────────────────────────────────────────
export const reportRouter = express.Router();
reportRouter.post("/generate", protect, async (req, res) => {
  try {
    const { profile, loanData, careerData, financeData } = req.body;
    const prompt = `Life plan report. ONLY JSON:\n${JSON.stringify({ profile, loanData, careerData, financeData })}\n{"overallScore":<0-100>,"executiveSummary":"<3-4 sentences>","keyStrengths":["<s1>","<s2>","<s3>"],"criticalActions":[{"priority":<1-5>,"action":"<action>","impact":"<impact>","timeline":"<when>"}],"fiveYearOutlook":"<2-3 sentences>","netWorthProjection5yr":<n>,"debtFreeDate":"<Month Year>","careerGrowthPct":<n>,"sections":{"career":{"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},"finance":{"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},"debt":{"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"},"goals":{"score":<0-100>,"status":"<On Track|Needs Work|Critical>","summary":"<1 sentence>"}}}`;

    const raw = await askGemini(prompt, "", false);
    const data = parseGeminiJSON(raw); // ✅ corrected
    if (!data) return res.status(502).json({ error: "Parse error" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CHAT ───────────────────────────────────────────────────
export const chatRouter = express.Router();
chatRouter.post("/message", protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const ctx = history.slice(-6).map(h => `${h.role}: ${h.content}`).join("\n");
    const full = ctx ? `${ctx}\nUser: ${message}` : message;
    const SYS = `You are LifePath AI, friendly Indian financial advisor. Use ₹, LPA, lakh, crore. Reference SIP,PPF,ELSS,NPS,FD. Be concise, warm, actionable. Under 200 words.`;

    const response = await askGemini(full, SYS, false);
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Chat unavailable. Retry." });
  }
});