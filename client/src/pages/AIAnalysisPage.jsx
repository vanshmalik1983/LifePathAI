import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, StatCard, Ring, ProgressBar, Badge, Btn, Input, Select, SectionHeader, ScoreGauge, CheckRow, LoadingCard, EmptyState, Tabs } from "../components/UI";
import { api } from "../utils/api";

const EDUCATION_OPTS = [
  {value:"10th",label:"10th"},{value:"12th",label:"12th"},{value:"diploma",label:"Diploma"},
  {value:"btech",label:"B.Tech / B.E"},{value:"mtech",label:"M.Tech / M.E"},
  {value:"mba",label:"MBA"},{value:"phd",label:"PhD"},{value:"other",label:"Other"},
];
const WORK_OPTS = [{value:"office",label:"Office"},{value:"remote",label:"Remote"},{value:"hybrid",label:"Hybrid"}];
const RISK_OPTS = [{value:"low",label:"Low – Stability first"},{value:"medium",label:"Medium – Balanced"},{value:"high",label:"High – Growth oriented"}];

const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${Math.round(n||0).toLocaleString("en-IN")}`;

export default function AIAnalysisPage() {
  const [form, setForm] = useState({
    currentRole:"", currentSalary:"", experience:"", skills:"",
    education:"btech", industry:"", location:"Bangalore, India",
    careerGoal:"", workStyle:"hybrid", riskAppetite:"medium",
    targetSalary:"", timeframe:"3",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("matches");
  const [selected, setSelected] = useState(0);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async () => {
    if (!form.currentRole || !form.currentSalary || !form.skills || !form.careerGoal) {
      setError("Please fill: Current Role, Salary, Skills, and Career Goal"); return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const body = {
        ...form,
        currentSalary: Number(form.currentSalary),
        experience:    Number(form.experience),
        targetSalary:  Number(form.targetSalary || 0),
        timeframe:     Number(form.timeframe),
        skills:        form.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      const data = await api.analyzeCareer(body);
      setResult(data);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  };

  const TABS = [
    {id:"matches",   label:"Career Matches", icon:"🎯"},
    {id:"skills",    label:"Skills",         icon:"⚡"},
    {id:"roadmap",   label:"Roadmap",        icon:"🗺"},
    {id:"salary",    label:"Salary Growth",  icon:"📈"},
    {id:"resources", label:"Free Resources", icon:"📚"},
  ];

  const demandColor = d => d==="Very High"?"#22C55E":d==="High"?"#38BDF8":d==="Medium"?"#FBBF24":"#EF4444";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>

      {/* Header */}
      <div className="animate-fadeUp" style={{background:"linear-gradient(135deg,rgba(108,99,255,0.18),rgba(56,189,248,0.1))",border:"1px solid rgba(108,99,255,0.25)",borderRadius:16,padding:"20px 28px"}}>
        <div style={{fontSize:24,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:6}}>🧠 AI Career Analysis</div>
        <div style={{fontSize:14,color:"#94A3B8"}}>Get AI-powered career path recommendations, skill gap analysis, and a personalised roadmap for the Indian job market</div>
      </div>

      {/* Form */}
      <Card className="animate-fadeUp delay-1">
        <SectionHeader title="Your Career Profile" sub="The more details you provide, the better the analysis"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          <Input label="Current Job Role" value={form.currentRole} onChange={e=>set("currentRole",e.target.value)} placeholder="Software Engineer"/>
          <Input label="Current Salary (Annual)" type="number" prefix="₹" value={form.currentSalary} onChange={e=>set("currentSalary",e.target.value)} placeholder="800000"/>
          <Input label="Years of Experience" type="number" value={form.experience} onChange={e=>set("experience",e.target.value)} placeholder="3"/>
          <Input label="Industry" value={form.industry} onChange={e=>set("industry",e.target.value)} placeholder="Information Technology"/>
          <Select label="Education" options={EDUCATION_OPTS} value={form.education} onChange={e=>set("education",e.target.value)}/>
          <Input label="Location" value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Bangalore, India"/>
          <Select label="Work Style" options={WORK_OPTS} value={form.workStyle} onChange={e=>set("workStyle",e.target.value)}/>
          <Select label="Risk Appetite" options={RISK_OPTS} value={form.riskAppetite} onChange={e=>set("riskAppetite",e.target.value)}/>
          <Input label="Target Salary (Annual)" type="number" prefix="₹" value={form.targetSalary} onChange={e=>set("targetSalary",e.target.value)} placeholder="1500000"/>
          <Input label="Timeframe (years)" type="number" value={form.timeframe} onChange={e=>set("timeframe",e.target.value)} placeholder="3"/>
        </div>
        <Input label="Your Skills (comma-separated)" value={form.skills} onChange={e=>set("skills",e.target.value)} placeholder="React, Node.js, Python, SQL, Communication" style={{marginTop:16}}/>
        <Input label="Career Goal (describe your dream role)" value={form.careerGoal} onChange={e=>set("careerGoal",e.target.value)} placeholder="Become a Senior Full Stack Engineer at a product company with ₹25 LPA" style={{marginTop:16}}/>
        {error && <div style={{marginTop:12,padding:"10px 16px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {error}</div>}
        <Btn onClick={handleSubmit} loading={loading} style={{marginTop:20,padding:"14px 32px",fontSize:15}} icon="🧠">
          {loading ? "Analyzing with Gemini AI…" : "Analyse My Career Path"}
        </Btn>
      </Card>

      {loading && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[1,2,3,4].map(i=><LoadingCard key={i} lines={3}/>)}
        </div>
      )}

      {result && !loading && (
        <div className="animate-fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
            <StatCard label="Career Score"    value={`${result.overallScore}/100`} sub={result.marketability} subColor="#6C63FF" icon="⭐"/>
            <StatCard label="Best Match"      value={result.topMatches?.[0]?.title||"—"} sub={result.topMatches?.[0]?.salaryRange} subColor="#22C55E" icon="🎯"/>
            <StatCard label="Growth Outlook"  value={result.topMatches?.[0]?.growthRate||"—"} sub="Annual growth" subColor="#38BDF8" icon="📈"/>
            <StatCard label="Skill Gaps"      value={result.skillAnalysis?.gaps?.length||0} sub="Skills to learn" subColor="#FBBF24" icon="⚡"/>
          </div>

          {/* Summary */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"start"}}>
            <Card style={{borderLeft:"3px solid #6C63FF"}}>
              <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>🤖 AI Career Summary</div>
              <p style={{fontSize:14,color:"#CBD5E1",lineHeight:1.8}}>{result.summary}</p>
              {result.indianMarketInsights && (
                <div style={{marginTop:14,padding:"12px 14px",background:"rgba(34,197,94,0.08)",borderRadius:10,border:"1px solid rgba(34,197,94,0.2)"}}>
                  <div style={{fontSize:12,color:"#86EFAC",fontWeight:600,marginBottom:4}}>🇮🇳 Indian Market Insight</div>
                  <p style={{fontSize:13,color:"#CBD5E1",lineHeight:1.6}}>{result.indianMarketInsights}</p>
                </div>
              )}
            </Card>
            <Card style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <ScoreGauge score={result.overallScore} label="Career Score"/>
              <Badge color={result.marketability==="Very High"?"#22C55E":result.marketability==="High"?"#38BDF8":"#FBBF24"}>{result.marketability}</Badge>
            </Card>
          </div>

          <Tabs tabs={TABS} active={tab} onChange={setTab}/>

          {/* Career Matches */}
          {tab==="matches" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16,alignItems:"start"}}>
              <Card>
                <SectionHeader title="Top Career Matches" sub="Ranked by AI based on your profile"/>
                {result.topMatches?.map((m,i)=>(
                  <div key={i} onClick={()=>setSelected(i)} className={`animate-slideIn delay-${i+1}`}
                    style={{padding:"14px 16px",borderRadius:12,cursor:"pointer",marginBottom:10,
                      background:selected===i?"rgba(108,99,255,0.12)":"rgba(255,255,255,0.02)",
                      border:selected===i?"1px solid rgba(108,99,255,0.4)":"1px solid transparent",transition:"all 0.2s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:30,height:30,borderRadius:8,background:"rgba(108,99,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#A5B4FC",fontSize:13}}>#{i+1}</div>
                        <div>
                          <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9"}}>{m.title}</div>
                          <div style={{fontSize:12,color:"#64748B"}}>{m.timeToTransition} to transition</div>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:15,fontWeight:800,color:"#22C55E"}}>{m.salaryRange}</div>
                        <Badge color={demandColor(m.demandLevel)} style={{fontSize:10}}>{m.demandLevel} Demand</Badge>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <ProgressBar value={m.matchPercent} color="#6C63FF" height={5} style={{flex:1}}/>
                      <span style={{fontSize:13,fontWeight:700,color:"#A5B4FC",minWidth:36}}>{m.matchPercent}%</span>
                    </div>
                  </div>
                ))}
              </Card>

              {result.topMatches?.[selected] && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Card style={{background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(56,189,248,0.06))",border:"1px solid rgba(108,99,255,0.3)"}}>
                    <Ring value={result.topMatches[selected].matchPercent} size={80} stroke={7} color="#6C63FF" label={`${result.topMatches[selected].matchPercent}%`} sublabel="match"/>
                    <div style={{fontSize:17,fontWeight:800,fontFamily:"'Syne',sans-serif",marginTop:12}}>{result.topMatches[selected].title}</div>
                    <div style={{fontSize:18,fontWeight:800,color:"#22C55E",margin:"4px 0 8px"}}>{result.topMatches[selected].salaryRange}</div>
                    <div style={{fontSize:12,color:"#64748B",marginBottom:12}}>Top companies: {result.topMatches[selected].companies?.join(", ")}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"#94A3B8",marginBottom:6}}>Skills you have ✅</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                      {result.topMatches[selected].requiredSkills?.map(s=><Badge key={s} color="#22C55E" style={{fontSize:10}}>{s}</Badge>)}
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:"#94A3B8",marginBottom:6}}>Skills to learn 📚</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {result.topMatches[selected].missingSkills?.map(s=><Badge key={s} color="#FBBF24" style={{fontSize:10}}>{s}</Badge>)}
                    </div>
                  </Card>
                  <Card>
                    <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>💡 Interview Tips</div>
                    {result.interviewTips?.slice(0,3).map((t,i)=><CheckRow key={i} color="#38BDF8">{t}</CheckRow>)}
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {tab==="skills" && result.skillAnalysis && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Card>
                <SectionHeader title="💪 Your Strengths"/>
                {result.skillAnalysis.strengths?.map((s,i)=>(
                  <div key={i} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:14,fontWeight:600,color:"#F1F5F9"}}>{s.skill}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,color:"#22C55E"}}>{s.marketValue}</span>
                        <span style={{fontSize:13,fontWeight:700,color:"#22C55E"}}>{s.score}%</span>
                      </div>
                    </div>
                    <ProgressBar value={s.score} color={s.score>=80?"#22C55E":"#6C63FF"} height={7}/>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionHeader title="📚 Skill Gaps to Fill"/>
                {result.skillAnalysis.gaps?.map((g,i)=>(
                  <div key={i} style={{marginBottom:14,padding:"12px 14px",background:"rgba(251,191,36,0.05)",borderRadius:10,border:"1px solid rgba(251,191,36,0.15)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{g.skill}</span>
                      <Badge color={g.importance==="High"?"#EF4444":g.importance==="Medium"?"#FBBF24":"#22C55E"} style={{fontSize:10}}>{g.importance}</Badge>
                    </div>
                    <div style={{fontSize:12,color:"#94A3B8",marginBottom:6}}>⏱ {g.learningTime} to learn</div>
                    <div style={{fontSize:12,color:"#38BDF8"}}>🔗 {g.freeResource}</div>
                  </div>
                ))}
                <div style={{marginTop:14,padding:"12px 14px",background:"rgba(56,189,248,0.08)",borderRadius:10,border:"1px solid rgba(56,189,248,0.2)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#38BDF8",marginBottom:8}}>🔥 Trending Skills in 2025</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {result.skillAnalysis.trending?.map(s=><Badge key={s} color="#38BDF8" style={{fontSize:11}}>{s}</Badge>)}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Roadmap */}
          {tab==="roadmap" && result.roadmap && (
            <Card>
              <SectionHeader title="🗺 Personalised Career Roadmap" sub="Your AI-generated step-by-step plan"/>
              <div style={{position:"relative",paddingLeft:32}}>
                <div style={{position:"absolute",left:12,top:0,bottom:0,width:2,background:"linear-gradient(180deg,#6C63FF,#38BDF8)",borderRadius:2}}/>
                {result.roadmap.map((phase,i)=>(
                  <div key={i} className={`animate-slideIn delay-${i+1}`} style={{position:"relative",marginBottom:32}}>
                    <div style={{position:"absolute",left:-26,top:0,width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"white",border:"3px solid #080814"}}>
                      {phase.phase}
                    </div>
                    <div style={{background:"rgba(108,99,255,0.07)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:14,padding:"18px 20px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{fontSize:16,fontWeight:700,color:"#F1F5F9"}}>{phase.title}</div>
                        <Badge color="#38BDF8">{phase.duration}</Badge>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,marginBottom:12}}>
                        {phase.actions?.map((a,j)=>(
                          <div key={j} style={{display:"flex",gap:8,padding:"8px 10px",background:"rgba(13,13,31,0.5)",borderRadius:8}}>
                            <span style={{color:"#6C63FF",flexShrink:0}}>→</span>
                            <span style={{fontSize:13,color:"#CBD5E1"}}>{a}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{padding:"10px 14px",background:"rgba(34,197,94,0.08)",borderRadius:8,border:"1px solid rgba(34,197,94,0.2)"}}>
                        <span style={{fontSize:12,color:"#86EFAC",fontWeight:600}}>🏆 Milestone: </span>
                        <span style={{fontSize:13,color:"#CBD5E1"}}>{phase.milestone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Salary Growth */}
          {tab==="salary" && result.salaryProjection && (
            <Card>
              <SectionHeader title="📈 Salary Growth Projection"/>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={result.salaryProjection} margin={{top:10,right:20,left:10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="year" stroke="#475569" tickFormatter={v=>`Yr ${v}`} style={{fontSize:11}}/>
                  <YAxis stroke="#475569" tickFormatter={v=>fmt(v)} style={{fontSize:11}}/>
                  <Tooltip formatter={v=>[fmt(v),"Salary"]} contentStyle={{background:"#0F0F1F",border:"1px solid #6C63FF",borderRadius:8,fontSize:12}}/>
                  <Line type="monotone" dataKey="salary" stroke="#6C63FF" strokeWidth={3} dot={{fill:"#6C63FF",r:5}} activeDot={{r:8}}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Free Resources */}
          {tab==="resources" && result.freeResources && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
              {result.freeResources.map((r,i)=>(
                <Card key={i} className={`animate-fadeUp delay-${i+1}`} style={{borderLeft:"3px solid #6C63FF"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{r.name}</div>
                    <Badge color={r.type==="Course"?"#6C63FF":r.type==="YouTube"?"#EF4444":"#22C55E"} style={{fontSize:10}}>{r.type}</Badge>
                  </div>
                  <div style={{fontSize:12,color:"#64748B",marginBottom:8}}>⭐ {r.rating}</div>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#38BDF8",wordBreak:"break-all"}}>{r.url}</a>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <EmptyState icon="🧠" title="Ready to analyse your career" sub="Fill your profile above for a personalised AI-powered career roadmap"/>
      )}
    </div>
  );
}
