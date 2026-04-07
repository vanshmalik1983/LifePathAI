import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, StatCard, Ring, ProgressBar, Badge, Btn, Input, Select, SectionHeader, ScoreGauge, CheckRow, LoadingCard, EmptyState, Tabs } from "../components/UI";
import { api } from "../utils/api";

const DEBT_TYPES = [
  {value:"home_loan",      label:"🏠 Home Loan"},
  {value:"car_loan",       label:"🚗 Car Loan"},
  {value:"personal_loan",  label:"💸 Personal Loan"},
  {value:"credit_card",    label:"💳 Credit Card"},
  {value:"education_loan", label:"🎓 Education Loan"},
  {value:"multiple",       label:"📋 Multiple Debts"},
];

const fmt = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const COLOR_MAP = { Critical:"#EF4444", Poor:"#F97316", Fair:"#FBBF24", Good:"#22C55E", Excellent:"#38BDF8" };

export default function LoanReliefPage() {
  const [form, setForm] = useState({
    salary: "", otherIncome: "0", totalDebt: "", monthlyEMI: "",
    interestRate: "", debtType: "home_loan", creditScore: "700",
    monthlyExpenses: "", savingsGoal: "0", age: "30", dependents: "0",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [tab, setTab]       = useState("overview");
  const [strategy, setStrategy] = useState(0);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async () => {
    const required = ["salary","totalDebt","monthlyEMI","interestRate","monthlyExpenses"];
    for (const k of required) {
      if (!form[k]) { setError(`Please fill: ${k.replace(/([A-Z])/g,' $1')}`); return; }
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const body = Object.fromEntries(Object.entries(form).map(([k,v]) => [k, isNaN(v)||v===""?v:Number(v)]));
      const data = await api.analyzeLoan(body);
      setResult(data);
      setStrategy(data.strategies?.findIndex(s => s.recommended) ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    {id:"overview",   label:"Overview",   icon:"📊"},
    {id:"strategies", label:"Strategies", icon:"🎯"},
    {id:"budget",     label:"Budget",     icon:"💰"},
    {id:"projection", label:"Projection", icon:"📈"},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* ── Header ── */}
      <div className="animate-fadeUp" style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(108,99,255,0.1))", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"20px 28px" }}>
        <div style={{ fontSize:24, fontWeight:800, fontFamily:"'Syne',sans-serif", marginBottom:6 }}>💰 AI Loan Relief Advisor</div>
        <div style={{ fontSize:14, color:"#94A3B8" }}>Enter your financial details and get a personalized debt relief strategy powered by Gemini AI</div>
      </div>

      {/* ── Input Form ── */}
      <Card className="animate-fadeUp delay-1">
        <SectionHeader title="Your Financial Profile" sub="Fill in your details for accurate AI analysis"/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
          <Input label="Monthly Salary" type="number" prefix="₹" value={form.salary} onChange={e=>set("salary",e.target.value)} placeholder="50000"/>
          <Input label="Other Income (optional)" type="number" prefix="₹" value={form.otherIncome} onChange={e=>set("otherIncome",e.target.value)} placeholder="0"/>
          <Input label="Total Debt Amount" type="number" prefix="₹" value={form.totalDebt} onChange={e=>set("totalDebt",e.target.value)} placeholder="1500000"/>
          <Input label="Current Monthly EMI" type="number" prefix="₹" value={form.monthlyEMI} onChange={e=>set("monthlyEMI",e.target.value)} placeholder="15000"/>
          <Input label="Interest Rate (%)" type="number" suffix="%" value={form.interestRate} onChange={e=>set("interestRate",e.target.value)} placeholder="9.5"/>
          <Select label="Debt Type" options={DEBT_TYPES} value={form.debtType} onChange={e=>set("debtType",e.target.value)}/>
          <Input label="Monthly Expenses" type="number" prefix="₹" value={form.monthlyExpenses} onChange={e=>set("monthlyExpenses",e.target.value)} placeholder="25000"/>
          <Input label="Credit Score" type="number" value={form.creditScore} onChange={e=>set("creditScore",e.target.value)} placeholder="700"/>
          <Input label="Monthly Savings Goal" type="number" prefix="₹" value={form.savingsGoal} onChange={e=>set("savingsGoal",e.target.value)} placeholder="5000"/>
          <Input label="Age" type="number" value={form.age} onChange={e=>set("age",e.target.value)} placeholder="30"/>
          <Input label="Dependents" type="number" value={form.dependents} onChange={e=>set("dependents",e.target.value)} placeholder="0"/>
        </div>
        {error && (
          <div style={{ marginTop:12, padding:"10px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, color:"#FCA5A5", fontSize:13 }}>
            ⚠️ {error}
          </div>
        )}
        <Btn onClick={handleSubmit} loading={loading} style={{ marginTop:20, padding:"14px 32px", fontSize:15 }} icon="✨">
          {loading ? "Analyzing with Gemini AI…" : "Analyze My Debt Situation"}
        </Btn>
      </Card>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
          {[1,2,3,4].map(i => <LoadingCard key={i} lines={3}/>)}
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="animate-fadeUp" style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Quick stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Health Score" value={`${result.healthScore}/100`} sub={result.healthLabel} subColor={COLOR_MAP[result.healthLabel]||"#FBBF24"} icon="🏥"/>
            <StatCard label="Debt Free In" value={`${result.debtFreeMonths}mo`} sub={`~${Math.ceil(result.debtFreeMonths/12)} years`} subColor="#38BDF8" icon="🎉"/>
            <StatCard label="Interest Payable" value={fmt(result.totalInterestPayable)} sub="On current plan" subColor="#EF4444" icon="📊"/>
            <StatCard label="Possible Savings" value={fmt(result.monthlySavingsPossible)} sub="Per month" subColor="#22C55E" icon="💎"/>
          </div>

          {/* Summary + Score */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
            <Card style={{ borderLeft:`3px solid ${COLOR_MAP[result.healthLabel]||"#FBBF24"}` }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F1F5F9", marginBottom:8 }}>🤖 AI Analysis Summary</div>
              <p style={{ fontSize:14, color:"#CBD5E1", lineHeight:1.8 }}>{result.summary}</p>
              {result.warnings?.length > 0 && (
                <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(239,68,68,0.08)", borderRadius:10, border:"1px solid rgba(239,68,68,0.2)" }}>
                  {result.warnings.map((w,i) => <div key={i} style={{ color:"#FCA5A5", fontSize:13, marginBottom:4 }}>⚠️ {w}</div>)}
                </div>
              )}
            </Card>
            <Card style={{ padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <ScoreGauge score={result.healthScore} label="Debt Health"/>
              <div style={{ fontSize:11, color:"#64748B", textAlign:"center" }}>DTI: {result.inputs?.debtToIncome}%</div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs tabs={TABS} active={tab} onChange={setTab}/>

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {/* Quick Wins */}
                <Card>
                  <SectionHeader title="⚡ Quick Wins" sub="Act on these immediately"/>
                  {result.quickWins?.map((w,i) => (
                    <div key={i} className={`animate-slideIn delay-${i+1}`} style={{ display:"flex", gap:10, marginBottom:12, padding:"10px 12px", background:"rgba(34,197,94,0.05)", borderRadius:10, border:"1px solid rgba(34,197,94,0.15)" }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>✅</span>
                      <span style={{ fontSize:13, color:"#CBD5E1", lineHeight:1.5 }}>{w}</span>
                    </div>
                  ))}
                </Card>

                {/* Indian Products */}
                <Card>
                  <SectionHeader title="🇮🇳 Indian Financial Products" sub="Recommended for you"/>
                  {result.indianProducts?.map((p,i) => (
                    <div key={i} style={{ marginBottom:14, padding:"12px 14px", background:"rgba(108,99,255,0.06)", borderRadius:10, border:"1px solid rgba(108,99,255,0.15)" }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#A5B4FC", marginBottom:4 }}>{p.name}</div>
                      <div style={{ fontSize:12, color:"#CBD5E1", marginBottom:4 }}>{p.benefit}</div>
                      <Badge color="#6C63FF" style={{ fontSize:10 }}>{p.eligibility}</Badge>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── Strategies ── */}
          {tab === "strategies" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
                {result.strategies?.map((s,i) => (
                  <div key={i} onClick={() => setStrategy(i)} style={{ padding:20, borderRadius:14, cursor:"pointer", background:strategy===i?"rgba(108,99,255,0.15)":"rgba(13,13,31,0.9)", border:strategy===i?"1px solid rgba(108,99,255,0.5)":"1px solid rgba(108,99,255,0.15)", transition:"all 0.2s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:"#F1F5F9" }}>{s.name}</div>
                      {s.recommended && <Badge color="#22C55E" style={{ fontSize:10 }}>⭐ Recommended</Badge>}
                    </div>
                    <p style={{ fontSize:13, color:"#94A3B8", lineHeight:1.6, marginBottom:12 }}>{s.description}</p>
                    <div style={{ display:"flex", gap:20 }}>
                      <div><div style={{ fontSize:10, color:"#64748B" }}>PAYOFF TIME</div><div style={{ fontSize:18, fontWeight:800, color:"#38BDF8" }}>{s.monthsToPayoff}mo</div></div>
                      <div><div style={{ fontSize:10, color:"#64748B" }}>INTEREST SAVED</div><div style={{ fontSize:18, fontWeight:800, color:"#22C55E" }}>{fmt(s.interestSaved)}</div></div>
                    </div>
                  </div>
                ))}
              </div>

              {result.strategies?.[strategy] && (
                <Card style={{ borderLeft:"3px solid #6C63FF" }}>
                  <SectionHeader title={`📋 ${result.strategies[strategy].name} — Step by Step`}/>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
                    {result.strategies[strategy].steps?.map((step,i) => (
                      <div key={i} className={`animate-slideIn delay-${i+1}`} style={{ display:"flex", gap:12, padding:"12px 14px", background:"rgba(108,99,255,0.07)", borderRadius:10 }}>
                        <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(108,99,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#A5B4FC", flexShrink:0 }}>{i+1}</div>
                        <span style={{ fontSize:13, color:"#CBD5E1", lineHeight:1.5 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── Budget ── */}
          {tab === "budget" && result.monthlyBudget && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Card>
                <SectionHeader title="💸 Recommended Monthly Budget"/>
                {[
                  { key:"essentials", label:"Essentials & Needs",  color:"#38BDF8" },
                  { key:"emi",        label:"EMI Payments",         color:"#EF4444" },
                  { key:"savings",    label:"Savings & Investments",color:"#22C55E" },
                  { key:"discretionary",label:"Discretionary",     color:"#FBBF24" },
                ].map(item => {
                  const val = result.monthlyBudget[item.key];
                  const total = result.inputs?.totalIncome || 1;
                  const pct = Math.round((val/total)*100);
                  return (
                    <div key={item.key} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:13, color:"#CBD5E1" }}>{item.label}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:item.color }}>{fmt(val)} <span style={{ color:"#64748B", fontWeight:400 }}>({pct}%)</span></span>
                      </div>
                      <ProgressBar value={pct} color={item.color} height={8}/>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <SectionHeader title="📊 Income Breakdown"/>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={[
                      {name:"Essentials", value: result.monthlyBudget.essentials},
                      {name:"EMI",        value: result.monthlyBudget.emi},
                      {name:"Savings",    value: result.monthlyBudget.savings},
                      {name:"Discretionary",value:result.monthlyBudget.discretionary},
                    ]} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                      {["#38BDF8","#EF4444","#22C55E","#FBBF24"].map((c,i)=><Cell key={i} fill={c}/>)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* ── Projection ── */}
          {tab === "projection" && result.projections && (
            <Card>
              <SectionHeader title="📈 Debt Payoff Projection"/>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={result.projections} margin={{top:10,right:20,left:20,bottom:0}}>
                  <defs>
                    <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity="0.3"/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" stroke="#475569" tickFormatter={v=>`M${v}`} style={{fontSize:11}}/>
                  <YAxis stroke="#475569" tickFormatter={v=>fmt(v)} style={{fontSize:11}}/>
                  <Tooltip formatter={v=>[fmt(v),"Remaining Debt"]} contentStyle={{background:"#0F0F1F",border:"1px solid #6C63FF",borderRadius:8,fontSize:12}}/>
                  <Area type="monotone" dataKey="debt" stroke="#EF4444" strokeWidth={2.5} fill="url(#debtGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", justifyContent:"center", gap:32, marginTop:16, flexWrap:"wrap" }}>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:11, color:"#64748B" }}>TODAY</div><div style={{ fontSize:20, fontWeight:800, color:"#EF4444" }}>{fmt(result.inputs?.totalDebt)}</div></div>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:11, color:"#64748B" }}>MONTH {Math.round(result.debtFreeMonths/2)}</div><div style={{ fontSize:20, fontWeight:800, color:"#FBBF24" }}>{fmt((result.inputs?.totalDebt||0)/2)}</div></div>
                <div style={{ textAlign:"center" }}><div style={{ fontSize:11, color:"#64748B" }}>DEBT FREE</div><div style={{ fontSize:20, fontWeight:800, color:"#22C55E" }}>₹0</div></div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty */}
      {!result && !loading && (
        <EmptyState icon="💰" title="Ready to analyze your debt" sub="Fill in your details above and click 'Analyze' for personalized AI-powered relief strategies"/>
      )}
    </div>
  );
}
