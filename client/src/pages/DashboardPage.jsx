import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, StatCard, Ring, ProgressBar, Badge, Btn, SectionHeader, fmt } from "../components/UI";
import { useAuth } from "../context/AuthContext";

const SCORE_COLOR = s => s>=80?"#22C55E":s>=60?"#FBBF24":s>=40?"#F97316":"#EF4444";

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const p = user?.profile || {};

  // Derived numbers from onboarding profile
  const monthlySalary   = Number(p.monthlySalary   || (p.annualSalary ? p.annualSalary/12 : 0));
  const monthlyExpenses = Number(p.monthlyExpenses  || 0);
  const savings         = Number(p.savings          || 0);
  const totalDebt       = Number(p.totalDebt        || 0);
  const monthlyEMI      = Number(p.monthlyEMI       || 0);
  const netSavings      = monthlySalary - monthlyExpenses - monthlyEMI;
  const savingsRate     = monthlySalary > 0 ? Math.round((netSavings / monthlySalary) * 100) : 0;

  // Projected net worth (simple compound: 12% annual growth on savings + monthly additions)
  const projectedNW5yr  = Math.round(savings * Math.pow(1.12, 5) + netSavings * 12 * ((Math.pow(1.12, 5)-1) / 0.12));
  const debtToIncome    = monthlySalary > 0 ? Math.round((monthlyEMI / monthlySalary) * 100) : 0;

  // Score calculations
  const financialScore = Math.min(100, Math.max(0,
    (savingsRate >= 20 ? 30 : savingsRate >= 10 ? 15 : 5) +
    (debtToIncome <= 30 ? 30 : debtToIncome <= 50 ? 15 : 5) +
    (savings >= 300000 ? 20 : savings >= 100000 ? 10 : 5) +
    (totalDebt === 0 ? 20 : totalDebt < 500000 ? 10 : 5)
  ));
  const careerScore = Math.min(100, 50 + (Number(p.experience || 0) * 5));

  // Wealth chart: 12 months projection
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const wealthData = months.map((m, i) => ({
    m,
    netWorth: Math.round(savings + netSavings * (i + 1)),
    savings:  Math.round(savings + (netSavings > 0 ? netSavings : 0) * (i + 1)),
  }));

  // Activity (static but personalized)
  const activity = [
    { emoji:"💵", label:"Salary Credit",        amount:`+${fmt(monthlySalary)}`,    date:"Today",     color:"#22C55E" },
    { emoji:"🏦", label:"EMI Payment",           amount:`-${fmt(monthlyEMI)}`,       date:"Today",     color:"#EF4444" },
    { emoji:"💰", label:"Expenses (Estimated)",  amount:`-${fmt(monthlyExpenses)}`,  date:"This month",color:"#F97316" },
    { emoji:"📈", label:"Net Savings",           amount:`+${fmt(Math.max(0,netSavings))}`, date:"This month",color:"#6C63FF" },
  ].filter(a => !a.amount.includes("₹0"));

  const goals = (p.goals || []).map((g, i) => {
    const labels = { buy_home:"🏠 Buy a Home", retirement:"🌴 Early Retirement", emergency:"🛡 Emergency Fund", education:"🎓 Child's Education", car:"🚗 Buy a Car", travel:"✈️ World Travel", business:"🏢 Start Business", debt_free:"💸 Become Debt Free" };
    const colors = ["#6C63FF","#22C55E","#38BDF8","#FBBF24","#F97316","#EC4899","#8B5CF6","#14B8A6"];
    return { label: labels[g] || g, color: colors[i % colors.length], progress: Math.min(85, 10 + i * 15), emoji: labels[g]?.split(" ")[0] || "🎯" };
  });

  const lifescores = [
    { l:"Career",  s:careerScore,   c:"#6C63FF" },
    { l:"Finance", s:financialScore,c:"#22C55E" },
    { l:"Savings", s:Math.min(100, Math.round((savings/300000)*100)), c:"#38BDF8" },
    { l:"Debt",    s:Math.max(0, 100-debtToIncome*2), c:"#FBBF24" },
    { l:"Overall", s:Math.round((careerScore+financialScore)/2), c:"#EC4899" },
  ];

  const [chartTab, setChartTab] = useState("netWorth");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Welcome banner */}
      <div className="au glass" style={{ padding:"20px 24px", background:"linear-gradient(135deg,rgba(108,99,255,0.18),rgba(56,189,248,0.08))", border:"1px solid rgba(108,99,255,0.25)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>
            Good morning, {user?.name?.split(" ")[0] || "there"} 👋
          </div>
          <div style={{ fontSize:14, color:"#94A3B8", marginTop:4 }}>
            {p.currentRole ? `${p.currentRole} · ${p.city || "India"}` : "Complete your profile to get AI insights"}
            {savingsRate > 0 && <span> · Saving <span style={{ color:"#22C55E", fontWeight:700 }}>{savingsRate}%</span> of income</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Btn variant="ghost" icon="📊" onClick={()=>onNavigate("pdf-report")}>Report</Btn>
          <Btn variant="primary" icon="🧠" onClick={()=>onNavigate("ai-analysis")}>AI Insights</Btn>
        </div>
      </div>

      {/* No profile warning */}
      {!p.monthlySalary && (
        <div className="au1" style={{ padding:"16px 20px", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:14, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:14, color:"#FCD34D" }}>
            ⚠️ <strong>Your dashboard shows sample data.</strong> Your actual financials will appear after completing your profile.
          </div>
          <Btn variant="secondary" style={{ fontSize:12, padding:"8px 16px" }} onClick={()=>onNavigate("onboarding")}>
            Complete Profile →
          </Btn>
        </div>
      )}

      {/* Stats row */}
      <div className="au1" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14 }}>
        <StatCard label="Net Worth"        value={fmt(savings)}             sub={`↑ +${fmt(Math.max(0,netSavings))}/mo`}     subColor="#22C55E" icon="💎"/>
        <StatCard label="Monthly Savings"  value={fmt(Math.max(0,netSavings))} sub={`${savingsRate}% savings rate`}          subColor={savingsRate>=20?"#22C55E":"#FBBF24"} icon="💰"/>
        <StatCard label="Total Debt"       value={totalDebt>0?fmt(totalDebt):"Debt Free 🎉"} sub={totalDebt>0?`${debtToIncome}% of income`:"Keep it up!"} subColor={totalDebt===0?"#22C55E":debtToIncome>50?"#EF4444":"#FBBF24"} icon="📉"/>
        <StatCard label="Net Worth (5yr)"  value={fmt(projectedNW5yr)}      sub="At 12% annual growth"                      subColor="#38BDF8"  icon="🚀"/>
      </div>

      {/* Chart + Goals */}
      <div className="au2" style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:18 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>Wealth Projection</div>
              <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#F1F5F9" }}>{fmt(savings + netSavings*6)}</div>
              <div style={{ fontSize:12, color:"#22C55E", fontWeight:600 }}>Projected in 6 months</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {["netWorth","savings"].map(t=>(
                <button key={t} onClick={()=>setChartTab(t)} style={{ background:chartTab===t?"rgba(108,99,255,0.2)":"transparent", border:chartTab===t?"1px solid rgba(108,99,255,0.5)":"1px solid rgba(255,255,255,0.08)", color:chartTab===t?"#A5B4FC":"#64748B", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", textTransform:"capitalize" }}>
                  {t === "netWorth" ? "Net Worth" : "Savings"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={wealthData} margin={{top:0,right:0,left:0,bottom:0}}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity="0.35"/>
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="m" stroke="#475569" style={{fontSize:10}}/>
              <YAxis stroke="#475569" tickFormatter={v=>fmt(v)} style={{fontSize:10}} width={70}/>
              <Tooltip formatter={v=>[fmt(v),"Value"]} contentStyle={{background:"#0F0F1F",border:"1px solid #6C63FF",borderRadius:8,fontSize:11}}/>
              <Area type="monotone" dataKey={chartTab} stroke="#6C63FF" strokeWidth={2.5} fill="url(#wGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionHeader title="Life Goals" sub={`${goals.length} active goals`}
            action={<Btn variant="ghost" style={{padding:"5px 10px",fontSize:11}} onClick={()=>onNavigate("goals")}>+ Add</Btn>}/>
          {goals.length > 0 ? goals.map((g,i) => (
            <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{g.emoji}</span>
                  <span style={{fontSize:13,fontWeight:600,color:"#F1F5F9"}}>{g.label.replace(/^[\S]+\s/,"")}</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:g.color}}>{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} color={g.color} height={5}/>
            </div>
          )) : (
            <div style={{textAlign:"center",padding:"20px 0",color:"#64748B"}}>
              <div style={{fontSize:32,marginBottom:8}}>🎯</div>
              <div style={{fontSize:13}}>No goals yet</div>
              <Btn variant="ghost" style={{fontSize:12,padding:"8px 14px",marginTop:10}} onClick={()=>onNavigate("goals")}>Add Goals</Btn>
            </div>
          )}
        </Card>
      </div>

      {/* Activity + Life Scores */}
      <div className="au3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <Card>
          <SectionHeader title="This Month's Activity"/>
          {activity.map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,0.02)",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${a.color}18`,border:`1px solid ${a.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{a.emoji}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#F1F5F9"}}>{a.label}</div>
                  <div style={{fontSize:11,color:"#475569"}}>{a.date}</div>
                </div>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:a.color}}>{a.amount}</div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionHeader title="Life Score Breakdown"/>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",paddingTop:8}}>
            {lifescores.map(({l,s,c})=>(
              <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <Ring value={s} size={68} stroke={6} color={c} label={`${s}`}/>
                <div style={{fontSize:11,fontWeight:600,color:"#94A3B8"}}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Profile summary card */}
      {p.currentRole && (
        <div className="au4" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
          <Card style={{borderLeft:"3px solid #6C63FF"}}>
            <div style={{fontSize:13,color:"#64748B",marginBottom:6}}>Current Role</div>
            <div style={{fontSize:17,fontWeight:700,color:"#F1F5F9"}}>{p.currentRole}</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>{p.industry} · {p.experience} yrs exp · {p.city}</div>
          </Card>
          <Card style={{borderLeft:"3px solid #22C55E"}}>
            <div style={{fontSize:13,color:"#64748B",marginBottom:6}}>Annual Income</div>
            <div style={{fontSize:17,fontWeight:700,color:"#22C55E"}}>{fmt(p.annualSalary || monthlySalary*12)}</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>Monthly: {fmt(monthlySalary)}</div>
          </Card>
          <Card style={{borderLeft:"3px solid #38BDF8"}}>
            <div style={{fontSize:13,color:"#64748B",marginBottom:6}}>Credit Score</div>
            <div style={{fontSize:17,fontWeight:700,color:p.creditScore>=750?"#22C55E":p.creditScore>=650?"#FBBF24":"#EF4444"}}>{p.creditScore || 700}</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>{p.creditScore>=750?"Excellent":p.creditScore>=650?"Good":"Needs Work"}</div>
          </Card>
          <Card style={{borderLeft:"3px solid #FBBF24"}}>
            <div style={{fontSize:13,color:"#64748B",marginBottom:6}}>Retire By</div>
            <div style={{fontSize:17,fontWeight:700,color:"#FBBF24"}}>{new Date().getFullYear() + Math.max(0, (p.targetRetirementAge||55) - (p.age||30))}</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>Target age {p.targetRetirementAge||55}</div>
          </Card>
        </div>
      )}

      {/* Quick action cards */}
      <div className="au5" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
        {[
          {icon:"💰",label:"Analyse Debt",       sub:"AI relief strategies",      color:"#EF4444", page:"loan-relief"},
          {icon:"🧠",label:"Career Analysis",    sub:"Find better opportunities", color:"#6C63FF", page:"ai-analysis"},
          {icon:"📈",label:"Finance Planning",   sub:"Investment & tax tips",     color:"#22C55E", page:"finance"},
          {icon:"💬",label:"Ask AI",             sub:"Chat with your advisor",    color:"#38BDF8", page:"chat"},
        ].map(a=>(
          <div key={a.label} onClick={()=>onNavigate(a.page)}
            style={{padding:"18px 20px",borderRadius:14,cursor:"pointer",background:`${a.color}11`,border:`1px solid ${a.color}22`,transition:"all 0.2s",display:"flex",alignItems:"center",gap:14}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${a.color}22`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <span style={{fontSize:28}}>{a.icon}</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{a.label}</div>
              <div style={{fontSize:12,color:"#64748B"}}>{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
