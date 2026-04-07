import { GoogleGenerativeAI } from "@google/generative-ai";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const cache = new NodeCache({ stdTTL: 300 });

const MODELS = [
  "models/gemini-2.5-pro",        // 🥇 Best all‑around model (complex reasoning, coding)
  "models/gemini-2.5-flash",      // ⚡ Fast, balanced, very reliable
  "models/gemini-2.5-flash-lite", // 💸 Most cost‑effective, high throughput
];

const SYSTEM = `You are LifePath AI, an expert Indian financial advisor and career coach.
RULES:
1. Always use ₹ INR, lakh/crore notation
2. Reference Indian products: SIP, PPF, ELSS, NPS, FD, RD, NSC, EPF, Sukanya
3. Reference Indian job market: Bangalore, Mumbai, Delhi, Hyderabad, Pune
4. Be specific, actionable, encouraging
5. CRITICAL: Return ONLY raw valid JSON. No markdown, no backticks, no explanation outside the JSON.`;

export async function askGemini(prompt, system = "", useCache = true) {
  if (!prompt) throw new Error("Prompt is required");

  const finalSystem = system || SYSTEM;
  const cacheKey = Buffer.from(finalSystem + prompt).toString("base64").slice(0, 100);

  if (useCache && cache.has(cacheKey)) {
    console.log("[GEMINI] cache hit");
    return cache.get(cacheKey);
  }

  let lastError;

  for (const MODEL of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[GEMINI] ${MODEL} attempt ${attempt}`);

        const model = genAI.getGenerativeModel({
          model: MODEL,
          systemInstruction: finalSystem,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        });

        const r = await model.generateContent(prompt);
        const text = r.response.text();

        if (useCache) cache.set(cacheKey, text);
        return text;
      } catch (err) {
        console.error(`[GEMINI] ${MODEL} attempt ${attempt}:`, err.message);
        lastError = err;

        if (err.status === 503 || err.message?.includes("503")) {
          break; // try next model
        }
        if (err.status === 429) {
          await new Promise(res => setTimeout(res, 2000 * attempt));
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

export function parseGeminiJSON(text) {
  if (!text) return null;

  try {
    let s = text.replace(/^\uFEFF/, "");
    s = s.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
    return JSON.parse(s);
  } catch (_) {
    try {
      const objMatch = text.match(/\{[\s\S]*\}/);
      const arrMatch = text.match(/\[[\s\S]*\]/);

      let best = null;
      if (objMatch && arrMatch) {
        best = text.indexOf(objMatch[0]) < text.indexOf(arrMatch[0])
          ? objMatch[0] : arrMatch[0];
      } else {
        best = objMatch?.[0] || arrMatch?.[0];
      }

      if (!best) throw new Error("No JSON structure found");
      return JSON.parse(best);
    } catch (e) {
      console.error("[JSON PARSE ERROR] Text snippet:", text?.slice(0, 300));
      return null;
    }
  }
}

export async function askGeminiJSON(prompt, system = "", useCache = true) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const raw = await askGemini(prompt, system, attempt === 1 ? useCache : false);
    const data = parseGeminiJSON(raw);
    if (data) return data;

    console.warn(`[GEMINI] JSON parse failed, retry ${attempt}/3`);
    await new Promise(res => setTimeout(res, 1000 * attempt));
  }
  throw new Error("Failed to parse Gemini JSON after 3 attempts");
}