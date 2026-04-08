import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import {
  loanRouter,
  careerRouter,
  financeRouter,
  goalsRouter,
  reportRouter,
  chatRouter,
} from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lifepathai")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ✅ CORS (FIXED 🔥)
const allowedOrigins = [
  "http://localhost:5173",
  "https://lifepathai-peach.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed: " + origin));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json({ limit: "2mb" }));

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: { error: "Too many requests, slow down." },
});

app.use("/api/", limiter);

// ✅ Routes
app.get("/api/health", (_, res) =>
  res.json({
    status: "ok",
    model: "gemini-1.5-flash",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRouter);
app.use("/api/career", careerRouter);
app.use("/api/finance", financeRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/report", reportRouter);
app.use("/api/chat", chatRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("[ERR]", err.message);
  res.status(500).json({ error: err.message });
});

// ✅ Server start
app.listen(PORT, () => {
  console.log(`\n🚀 LifePath AI v2 → http://localhost:${PORT}`);
  console.log(`   Model : gemini-1.5-flash`);
  console.log(
    `   Gemini: ${
      process.env.GEMINI_API_KEY ? "✅ Key found" : "❌ No key in .env"
    }`
  );
  console.log(
    `   DB    : ${
      process.env.MONGODB_URI || "mongodb://localhost:27017/lifepathai"
    }\n`
  );
});