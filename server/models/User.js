import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ProfileSchema = new mongoose.Schema({
  age: Number,
  city: String,
  phone: String,
  currentRole: String,
  experience: Number,
  industry: String,
  education: String,
  annualSalary: Number,
  otherIncome: { type: Number, default: 0 },
  monthlySalary: Number,
  monthlyExpenses: Number,
  savings: Number,
  totalDebt: { type: Number, default: 0 },
  monthlyEMI: { type: Number, default: 0 },
  creditScore: { type: Number, default: 700 },
  goals: { type: [String], default: [] },
  targetRetirementAge: { type: Number, default: 55 },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: "" },
  onboardingComplete: { type: Boolean, default: false },
  profile: { type: ProfileSchema, default: null },
  lastLoanAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  lastCareerAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  lastFinancePlan: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

// Password hashing
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.password);
};

// Safe JSON output
UserSchema.methods.toSafeJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);