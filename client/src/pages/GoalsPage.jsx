import { useState } from "react";
import { Card, StatCard, ProgressBar, Badge, Btn, Input, SectionHeader, ScoreGauge, CheckRow, LoadingCard, EmptyState } from "../components/UI";
import { api } from "../utils/api";

const fmt = n => {
  if(!n && n!==0) return "—";
  if(n>=10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if(n>=100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const GOAL_ICONS = ["🏠","🚗","✈️","💍","🎓","💰","🌴","🏋️","💻","🎯"];
const FEASIBILITY_COLOR = {Easy:"#22C55E",Moderate:"#38BDF8",Challenging:"#FBBF24",Difficult:"#EF4444"};

const DEFAULT_GOALS = [
  {name:"Buy a Home",    targetAmount:"5000000", months:"60"},
  {name:"Emergency Fund",targetAmount:"300000",  months:"12"},
  {name:"Car Purchase",  targetAmount:"800000",  months:"24"},
];

export default function GoalsPage() {
  const [income,   setIncome]   = useState("");
  const [savings,  setSavings]  = useState("");
  const [age,      setAge]      = useState("28");
  const [goals,    setGoals]    = useState(DEFAULT_GOALS);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [expanded, setExpanded] = useState(null);

  const addGoal = () => setGoals(g=>[...g,{name:"New Goal",targetAmount:"",months:"12"}]);
  const removeGoal = i => setGoals(g=>g.filter((_,j)=>j!==i));
  const updateGoal = (i,k,v) => { const g=[...goals]; g[i]={...g[i],[k]:v}; setGoals(g); };

  const handleSubmit = async () => {
    if(!income || !savings){ setError("Please fill Monthly Income and Current Savings"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const data = await api.goalsPlan({
        income: Number(income), savings: Number(savings), age: Number(age),
        goals: goals.filter(g=>g.targetAmount).map(g=>({...g,targetAmount:Number(g.targetAmount),months:Number(g.months)})),
      });
      setResult(data);
    } catch(e){ setError(e.message); }
    finally   { setLoading(false); }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>

      <div className="animate-fadeUp" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(108,99,255,0.1))",border:"1px solid rgba(251,191,36,0.2)",borderRadius:16,padding:"20px 28px"}}>
        <div style={{fontSize:24,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:6}}>🎯 Life Goals Planner</div>
        <div style={{fontSize:14,color:"#94A3B8"}}>Set your dreams and let AI build a concrete savings roadmap with Indian financial instruments</div>
      </div>

      {/* Profile */}
      <Card className="animate-fadeUp delay-1">
        <SectionHeader title="Your Profile"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
          <Input label="Monthly Income" type="number" prefix="₹" value={income} onChange={e=>setIncome(e.target.value)} placeholder="60000"/>
          <Input label="Current Savings" type="number" prefix="₹" value={savings} onChange={e=>setSavings(e.target.value)} placeholder="150000"/>
          <Input label="Age" type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="28"/>
        </div>

        <SectionHeader title="Your Goals" sub="Add all goals you want to achieve" action={<Btn variant="ghost" icon="➕" onClick={addGoal} style={{fontSize:12}}>Add Goal</Btn>}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
          {goals.map((g,i)=>(
            <div key={i} style={{padding:14,background:"rgba(251,191,36,0.05)",borderRadius:12,border:"1px solid rgba(251,191,36,0.15)",position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:22}}>{GOAL_ICONS[i%GOAL_ICONS.length]}</span>
                <input value={g.name} onChange={e=>updateGoal(i,"name",e.target.value)}
                  style={{flex:1,background:"transparent",border:"none",color:"#F1F5F9",fontSize:14,fontWeight:700,fontFamily:"inherit",outline:"none"}}/>
                <button onClick={()=>removeGoal(i)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16,padding:4}}>✕</button>
              </div>
              <Input label="Target Amount" type="number" prefix="₹" value={g.targetAmount} onChange={e=>updateGoal(i,"targetAmount",e.target.value)} placeholder="500000"/>
              <Input label="Timeline (months)" type="number" value={g.months} onChange={e=>updateGoal(i,"months",e.target.value)} style={{marginTop:10}}/>
            </div>
          ))}
        </div>

        {error && <div style={{marginTop:12,padding:"10px 16px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {error}</div>}
        <Btn onClick={handleSubmit} loading={loading} style={{marginTop:20,padding:"14px 32px",fontSize:15}} icon="🎯">
          {loading?"Generating Plan…":"Build My Goals Roadmap"}
        </Btn>
      </Card>

      {loading && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>{[1,2,3].map(i=><LoadingCard key={i} lines={4}/>)}</div>}

      {result && !loading && (
        <div className="animate-fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
            <StatCard label="Feasibility Score"   value={`${result.feasibilityScore}/100`} sub="Goal achievability" subColor="#22C55E" icon="🎯"/>
            <StatCard label="Total Monthly Needed" value={fmt(result.totalMonthlyRequired)} sub="For all goals" subColor="#FBBF24" icon="💰"/>
            <StatCard label="Goals Planned"        value={result.goals?.length||0} sub="Across all timeframes" subColor="#38BDF8" icon="📋"/>
          </div>

          <Card style={{borderLeft:"3px solid #FBBF24"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>🤖 AI Advice</div>
            <p style={{fontSize:14,color:"#CBD5E1",lineHeight:1.8}}>{result.advice}</p>
          </Card>

          {/* Priority order */}
          {result.priorityOrder?.length > 0 && (
            <Card>
              <SectionHeader title="📌 Recommended Priority Order"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {result.priorityOrder.map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.25)",borderRadius:30}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white"}}>{i+1}</div>
                    <span style={{fontSize:13,color:"#CBD5E1",fontWeight:600}}>{p}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Individual Goal Cards */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {result.goals?.map((g,i)=>(
              <Card key={i} className={`animate-fadeUp delay-${i+1}`}>
                <div onClick={()=>setExpanded(expanded===i?null:i)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:28}}>{GOAL_ICONS[i%GOAL_ICONS.length]}</span>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:"#F1F5F9"}}>{g.name}</div>
                      <div style={{fontSize:13,color:"#64748B"}}>Target: {fmt(g.targetAmount)} in {g.timelineMonths} months</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:15,fontWeight:800,color:"#FBBF24"}}>{fmt(g.monthlyRequired)}/mo</div>
                      <Badge color={FEASIBILITY_COLOR[g.feasibility]||"#FBBF24"} style={{fontSize:10}}>{g.feasibility}</Badge>
                    </div>
                    <span style={{color:"#475569",fontSize:18}}>{expanded===i?"▲":"▼"}</span>
                  </div>
                </div>

                {expanded===i && (
                  <div className="animate-fadeUp" style={{marginTop:18,paddingTop:18,borderTop:"1px solid rgba(108,99,255,0.15)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      <div>
                        <p style={{fontSize:14,color:"#CBD5E1",lineHeight:1.7,marginBottom:14}}>{g.strategy}</p>
                        <div style={{padding:"10px 14px",background:"rgba(56,189,248,0.08)",borderRadius:10,border:"1px solid rgba(56,189,248,0.2)"}}>
                          <div style={{fontSize:12,color:"#38BDF8",fontWeight:700,marginBottom:4}}>🇮🇳 Best Instrument</div>
                          <div style={{fontSize:13,color:"#CBD5E1"}}>{g.indianInstrument}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#94A3B8",marginBottom:10}}>📅 Milestones</div>
                        {g.milestones?.map((m,j)=>(
                          <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:"rgba(251,191,36,0.05)",borderRadius:8,marginBottom:6,border:"1px solid rgba(251,191,36,0.1)"}}>
                            <span style={{fontSize:12,color:"#94A3B8"}}>Month {m.month}</span>
                            <span style={{fontSize:12,fontWeight:700,color:"#FBBF24"}}>{fmt(m.amount)}</span>
                            <span style={{fontSize:12,color:"#CBD5E1"}}>{m.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && <EmptyState icon="🎯" title="Define your life goals" sub="Set your targets and get an AI-powered savings roadmap with Indian financial instruments"/>}
    </div>
  );
}
