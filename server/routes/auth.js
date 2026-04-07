import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ── SIGNUP ────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ error: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Email already registered. Please sign in." });

    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password });
    const token = signToken(user._id);
    res.status(201).json({ user: user.toSafeJSON(), token });
  } catch (err) {
    console.error("[SIGNUP FULL ERROR]", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ── SIGNIN ────────────────────────────────────────────────
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user._id);
    res.json({ user: user.toSafeJSON(), token });
  } catch (err) {
    console.error("[SIGNIN]", err.message);
    res.status(500).json({ error: "Sign in failed. Please try again." });
  }
});

// ── GET ME ─────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

// ── SAVE ONBOARDING PROFILE ────────────────────────────────
router.post("/profile", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: req.body, onboardingComplete: true },
      { new: true, runValidators: false }
    );
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error("[PROFILE]", err.message);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// ── UPDATE PROFILE ─────────────────────────────────────────
router.patch("/profile", protect, async (req, res) => {
  try {
    const updates = {};
    for (const [k, v] of Object.entries(req.body)) {
      updates[`profile.${k}`] = v;
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
