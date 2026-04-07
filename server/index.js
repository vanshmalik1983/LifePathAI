import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import { loanRouter, careerRouter, financeRouter, goalsRouter, reportRouter, chatRouter } from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lifepathai")
  .then(()=>console.log("✅ MongoDB connected"))
  .catch(err=>console.error("❌ MongoDB error:", err.message));

// Middleware
app.use(helmet({ crossOriginResourcePolicy:{ policy:"cross-origin" }}));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials:true }));
app.use(express.json({ limit:"2mb" }));

const limiter = rateLimit({ windowMs:60_000, max:50, message:{ error:"Too many requests, slow down." } });
app.use("/api/", limiter);

// Routes
app.get("/api/health", (_,res)=>res.json({ status:"ok", model:"gemini-1.5-flash", db:mongoose.connection.readyState===1?"connected":"disconnected" }));
app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRouter);
app.use("/api/career", careerRouter);
app.use("/api/finance", financeRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/report", reportRouter);
app.use("/api/chat", chatRouter);

app.use((err,req,res,_) => { console.error("[ERR]",err.message); res.status(500).json({ error:err.message }); });

app.listen(PORT, () => {
  console.log(`\n🚀 LifePath AI v2 → http://localhost:${PORT}`);
  console.log(`   Model : gemini-1.5-flash`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY?"✅ Key found":"❌ No key in .env"}`);
  console.log(`   DB    : ${process.env.MONGODB_URI || "mongodb://localhost:27017/lifepathai"}\n`);
});