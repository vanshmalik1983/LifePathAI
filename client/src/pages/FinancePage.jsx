import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, StatCard, Ring, ProgressBar, Badge, Btn, Input, Select, SectionHeader, ScoreGauge, CheckRow, LoadingCard, EmptyState, Tabs } from "../components/UI";
import { api } from "../utils/api";

const RISK_OPTS = [
  {value:"conservative", label:"Conservative – Low risk, FDs & bonds"},
  {value:"moderate",     label:"Moderate – Mix of equity & debt"},
  {value:"aggressive",   label:"Aggressive – High equity, max growth"},
];

const fmt = n => {
  if(!n && n!==0) return "—";
  if(n>=10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if(n>=100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const PIE_COLORS = ["#6C63FF","#38BDF8","#22C55E","#FBBF24"];

export default function FinancePage() {
  const [form, setForm] = useState({
    monthlyIncome:"", monthlyExpenses:"", savings:"",
    investments:"0", age:"30", riskProfile:"moderate",
    goals: [
      {name:"Emergency Fund", targetAmount:"", months:"6"},
      {name:"Retirement",     targetAmount:"", months:"360"},
    ],
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("overview");

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    if(!form.monthlyIncome || !form.monthlyExpenses || !form.savings){
      setError("Please fill: Monthly Income, Expenses, and Current Savings"); return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const body = {
        monthlyIncome:   Number(form.monthlyIncome),
        monthlyExpenses: Number(form.monthlyExpenses),
        savings:         Number(form.savings),
        investments:     Number(form.investments||0),
        age:             Number(form.age),
        riskProfile:     form.riskProfile,
        goals:           form.goals.filter(g=>g.targetAmount).map(g=>({...g,targetAmount:Number(g.targetAmount),months:Number(g.months)})),
      };
      const data = await api.financePlan(body);
      setResult(data);
    } catch(e){ setError(e.message); }
    finally   { setLoading(false); }
  };

  const updateGoal = (i,k,v) => {
    const gs = [...form.goals];
    gs[i] = {...gs[i],[k]:v};
    setForm(f=>({...f,goals:gs}));
  };

  const TABS = [
    {id:"overview",    label:"Overview",    icon:"📊"},
    {id:"investments", label:"Investments", icon:"💹"},
    {id:"tax",         label:"Tax Saving",  icon:"📑"},
    {id:"networth",    label:"Net Worth",   icon:"📈"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>

      <div className="animate-fadeUp" style={{background:"linear-gradient(135deg,rgba(34,197,94,0.15),rgba(56,189,248,0.1))",border:"1px solid rgba(34,197,94,0.2)",borderRadius:16,padding:"20px 28px"}}>
        <div style={{fontSize:24,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:6}}>📈 AI Finance Planner</div>
        <div style={{fontSize:14,color:"#94A3B8"}}>Get a personalised Indian investment strategy, tax-saving tips, and net worth projections</div>
      </div>

      <Card className="animate-fadeUp delay-1">
        <SectionHeader title="Financial Profile"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          <Input label="Monthly Income"   type="number" prefix="₹" value={form.monthlyIncome}   onChange={e=>set("monthlyIncome",e.target.value)}   placeholder="75000"/>
          <Input label="Monthly Expenses" type="number" prefix="₹" value={form.monthlyExpenses} onChange={e=>set("monthlyExpenses",e.target.value)} placeholder="40000"/>
          <Input label="Current Savings"  type="number" prefix="₹" value={form.savings}         onChange={e=>set("savings",e.target.value)}         placeholder="200000"/>
          <Input label="Current Investments" type="number" prefix="₹" value={form.investments}  onChange={e=>set("investments",e.target.value)}    placeholder="0"/>
          <Input label="Age"              type="number"              value={form.age}            onChange={e=>set("age",e.target.value)}            placeholder="30"/>
          <Select label="Risk Profile" options={RISK_OPTS} value={form.riskProfile} onChange={e=>set("riskProfile",e.target.value)}/>
        </div>

        {/* Goals */}
        <div style={{marginTop:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:12}}>🎯 Financial Goals</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:12}}>
            {form.goals.map((g,i)=>(
              <div key={i} style={{padding:"14px",background:"rgba(108,99,255,0.07)",borderRadius:12,border:"1px solid rgba(108,99,255,0.15)"}}>
                <Input label={`Goal: ${g.name}`} type="number" prefix="₹" value={g.targetAmount} onChange={e=>updateGoal(i,"targetAmount",e.target.value)} placeholder="Target amount"/>
                <Input label="Timeline (months)" type="number" value={g.months} onChange={e=>updateGoal(i,"months",e.target.value)} style={{marginTop:10}}/>
              </div>
            ))}
          </div>
          <Btn variant="ghost" icon="➕" onClick={()=>setForm(f=>({...f,goals:[...f.goals,{name:"New Goal",targetAmount:"",months:"12"}]}))} style={{marginTop:12,fontSize:12}}>
            Add Goal
          </Btn>
        </div>

        {error && <div style={{marginTop:12,padding:"10px 16px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {error}</div>}
        <Btn onClick={handleSubmit} loading={loading} style={{marginTop:20,padding:"14px 32px",fontSize:15}} icon="📈">
          {loading?"Generating Plan…":"Generate My Financial Plan"}
        </Btn>
      </Card>

      {loading && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>{[1,2,3,4].map(i=><LoadingCard key={i} lines={3}/>)}</div>}

      {result && !loading && (
        <div className="animate-fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
            <StatCard label="Financial Score"  value={`${result.financialScore}/100`} sub="Overall health" subColor="#22C55E" icon="💎"/>
            <StatCard label="Savings Rate"     value={`${result.savingsRate}%`} sub="Of income" subColor={result.savingsRate>=20?"#22C55E":"#FBBF24"} icon="💰"/>
            <StatCard label="Emergency Fund"   value={fmt(result.emergencyFund?.target)} sub={`${result.emergencyFund?.monthsToAchieve} months to build`} subColor="#38BDF8" icon="🛡"/>
            <StatCard label="Net Worth (10yr)" value={fmt(result.netWorthProjection?.find(p=>p.year===10)?.netWorth)} sub="Projected" subColor="#6C63FF" icon="🚀"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"start"}}>
            <Card style={{borderLeft:"3px solid #22C55E"}}>
              <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>🤖 Key Insights</div>
              {result.insights?.map((ins,i)=><CheckRow key={i} color="#22C55E">{ins}</CheckRow>)}
              {result.warnings?.filter(Boolean).map((w,i)=>(
                <div key={i} style={{padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",marginTop:8,fontSize:13,color:"#FCA5A5"}}>⚠️ {w}</div>
              ))}
            </Card>
            <Card style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <ScoreGauge score={result.financialScore} label="Financial Health"/>
            </Card>
          </div>

          <Tabs tabs={TABS} active={tab} onChange={setTab}/>

          {tab==="overview" && result.recommendedBudget && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Card>
                <SectionHeader title="💸 Recommended Budget Split"/>
                {[["needs","Needs & Essentials","#38BDF8"],["wants","Wants & Lifestyle","#FBBF24"],["savings","Savings","#22C55E"],["investments","Investments","#6C63FF"]].map(([k,l,c])=>(
                  <div key={k} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,color:"#CBD5E1"}}>{l}</span>
                      <span style={{fontSize:13,fontWeight:700,color:c}}>{result.recommendedBudget[k]}%</span>
                    </div>
                    <ProgressBar value={result.recommendedBudget[k]} color={c} height={8}/>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionHeader title="📊 Budget Allocation"/>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={Object.entries(result.recommendedBudget).map(([k,v])=>({name:k,value:v}))} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value})=>`${name} ${value}%`}>
                      {PIE_COLORS.map((c,i)=><Cell key={i} fill={c}/>)}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {tab==="investments" && result.investmentPlan && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
              {result.investmentPlan.map((inv,i)=>(
                <Card key={i} className={`animate-fadeUp delay-${i+1}`} style={{borderLeft:"3px solid #6C63FF"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9"}}>{inv.instrument}</div>
                    <Badge color="#6C63FF">{inv.allocation}</Badge>
                  </div>
                  <div style={{fontSize:13,color:"#94A3B8",marginBottom:8}}>{inv.reason}</div>
                  <div style={{fontSize:12,color:"#22C55E",marginBottom:4}}>Expected return: <strong>{inv.expectedReturn}</strong></div>
                  <div style={{fontSize:12,color:"#38BDF8",padding:"6px 10px",background:"rgba(56,189,248,0.08)",borderRadius:8,marginTop:8}}>
                    🇮🇳 {inv.indianOption}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab==="tax" && result.taxSavingTips && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
              {result.taxSavingTips.map((t,i)=>(
                <Card key={i} className={`animate-fadeUp delay-${i+1}`} style={{borderLeft:"3px solid #22C55E"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <Badge color="#22C55E" style={{fontSize:13,padding:"4px 12px"}}>{t.section}</Badge>
                    <span style={{fontSize:14,fontWeight:800,color:"#22C55E"}}>{t.maxDeduction}</span>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:6}}>{t.instrument}</div>
                  <div style={{fontSize:13,color:"#94A3B8"}}>{t.action}</div>
                </Card>
              ))}
            </div>
          )}

          {tab==="networth" && result.netWorthProjection && (
            <Card>
              <SectionHeader title="📈 Net Worth Projection (10 Years)"/>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={result.netWorthProjection} margin={{top:10,right:20,left:10,bottom:0}}>
                  <defs>
                    <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity="0.3"/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="year" stroke="#475569" tickFormatter={v=>`Yr ${v}`} style={{fontSize:11}}/>
                  <YAxis stroke="#475569" tickFormatter={v=>fmt(v)} style={{fontSize:11}}/>
                  <Tooltip formatter={v=>[fmt(v),"Net Worth"]} contentStyle={{background:"#0F0F1F",border:"1px solid #22C55E",borderRadius:8,fontSize:12}}/>
                  <Area type="monotone" dataKey="netWorth" stroke="#22C55E" strokeWidth={2.5} fill="url(#nwGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      {!result && !loading && <EmptyState icon="📈" title="Ready to plan your finances" sub="Fill your profile and get an AI-powered Indian investment plan"/>}
    </div>
  );
}
