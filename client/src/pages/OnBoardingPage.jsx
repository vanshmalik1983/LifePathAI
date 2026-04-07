import { useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const inp = {width:"100%",background:"rgba(15,15,35,0.8)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:12,padding:"12px 16px",color:"#F1F5F9",fontSize:14,outline:"none",fontFamily:"inherit",transition:"border-color 0.2s"};
const sel = {...inp,cursor:"pointer",appearance:"none"};
const lbl = {fontSize:12,fontWeight:600,color:"#94A3B8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:.5};
const F = ({label,children}) => <div><label style={lbl}>{label}</label>{children}</div>;

const STEPS=[
  {icon:"👤",title:"Personal Details",desc:"Tell us about yourself"},
  {icon:"💼",title:"Career & Income",desc:"Your work situation"},
  {icon:"💰",title:"Financial Snapshot",desc:"Your money at a glance"},
  {icon:"🎯",title:"Life Goals",desc:"What you want to achieve"},
];
const CITIES=["Bangalore","Mumbai","Delhi NCR","Hyderabad","Pune","Chennai","Kolkata","Ahmedabad","Jaipur","Other"];
const INDUSTRIES=["Information Technology","Finance & Banking","Healthcare","Education","Manufacturing","Retail","Government","Startup / Freelance","Other"];
const EDU=[["btech","B.Tech / B.E"],["mtech","M.Tech / M.E"],["mba","MBA"],["diploma","Diploma"],["12th","12th Pass"],["phd","PhD"],["other","Other"]];
const GOALS=[
  {id:"buy_home",label:"🏠 Buy a Home"},{id:"retirement",label:"🌴 Early Retirement"},
  {id:"emergency",label:"🛡 Emergency Fund"},{id:"education",label:"🎓 Child's Education"},
  {id:"car",label:"🚗 Buy a Car"},{id:"travel",label:"✈️ World Travel"},
  {id:"business",label:"🏢 Start a Business"},{id:"debt_free",label:"💸 Become Debt Free"},
];

export default function OnboardingPage({ onComplete }) {
  const { updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [ld, sLd] = useState(false);
  const [err, sErr] = useState("");
  const [p, sP] = useState({
    age:"",city:"",phone:"",
    currentRole:"",experience:"",industry:"",education:"btech",annualSalary:"",otherIncome:"0",
    monthlySalary:"",monthlyExpenses:"",savings:"",totalDebt:"0",monthlyEMI:"0",creditScore:"700",
    goals:[],targetRetirementAge:"55",
  });
  const set=(k,v)=>sP(x=>({...x,[k]:v}));
  const tog=(id)=>set("goals",p.goals.includes(id)?p.goals.filter(g=>g!==id):[...p.goals,id]);

  const validate=()=>{
    if(step===0&&!p.age){sErr("Please enter your age");return false;}
    if(step===1&&!p.currentRole){sErr("Please enter your current role");return false;}
    if(step===1&&!p.annualSalary){sErr("Please enter your annual salary");return false;}
    if(step===2&&!p.monthlySalary){sErr("Please fill monthly salary");return false;}
    if(step===2&&!p.monthlyExpenses){sErr("Please fill monthly expenses");return false;}
    if(step===2&&!p.savings){sErr("Please fill current savings");return false;}
    return true;
  };

  const next=()=>{if(validate()){sErr("");setStep(s=>s+1);}};
  const back=()=>{sErr("");setStep(s=>s-1);};

  const finish=async()=>{
    if(!validate())return;
    sLd(true);sErr("");
    try{
      const {user}=await api.saveProfile(p);
      updateUser(user);
      onComplete(user);
    }catch(e){sErr(e.message);}finally{sLd(false);}
  };

  const pct=(step/(STEPS.length-1))*100;

  return(
    <div style={{minHeight:"100vh",background:"#080814",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px",position:"relative"}}>
      <div style={{position:"fixed",top:"10%",left:"5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.1),transparent 70%)",filter:"blur(80px)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:600,position:"relative",zIndex:1}}>
        {/* Steps header */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:40,marginBottom:10}}>{STEPS[step].icon}</div>
          <div style={{fontSize:28,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:6}}>{STEPS[step].title}</div>
          <div style={{color:"#64748B",fontSize:15}}>{STEPS[step].desc}</div>
        </div>

        {/* Progress indicators */}
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:32}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:i<step?"#22C55E":i===step?"linear-gradient(135deg,#6C63FF,#38BDF8)":"#1E293B",border:i===step?"2px solid #6C63FF":"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<step?16:13,fontWeight:800,color:i<=step?"white":"#475569",transition:"all 0.3s",flexShrink:0,zIndex:1}}>
                {i<step?"✓":i+1}
              </div>
              {i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<step?"#22C55E":"#1E293B",transition:"background 0.5s"}}/>}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass" style={{padding:"36px 32px"}}>

          {step===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid-1">
                <F label="Age"><input type="number" value={p.age} onChange={e=>set("age",e.target.value)} placeholder="28" min="18" max="65" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="City"><select value={p.city} onChange={e=>set("city",e.target.value)} style={sel}><option value="">Select city</option>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select></F>
              </div>
              <F label="Phone (optional)"><input type="tel" value={p.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
              <div style={{padding:14,background:"rgba(108,99,255,0.07)",borderRadius:12,border:"1px solid rgba(108,99,255,0.15)",fontSize:13,color:"#94A3B8"}}>
                🔒 Your data is stored securely in our database and never shared with third parties.
              </div>
            </div>
          )}

          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid-1">
                <F label="Current Job Role"><input value={p.currentRole} onChange={e=>set("currentRole",e.target.value)} placeholder="Software Engineer" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Years of Experience"><input type="number" value={p.experience} onChange={e=>set("experience",e.target.value)} placeholder="3" min="0" max="40" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
              </div>
              <F label="Industry"><select value={p.industry} onChange={e=>set("industry",e.target.value)} style={sel}><option value="">Select industry</option>{INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}</select></F>
              <F label="Education"><select value={p.education} onChange={e=>set("education",e.target.value)} style={sel}>{EDU.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid-1">
                <F label="Annual Salary (₹)"><input type="number" value={p.annualSalary} onChange={e=>set("annualSalary",e.target.value)} placeholder="800000" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Other Income/mo (₹)"><input type="number" value={p.otherIncome} onChange={e=>set("otherIncome",e.target.value)} placeholder="0" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
              </div>
            </div>
          )}

          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid-1">
                <F label="Monthly Salary (₹)"><input type="number" value={p.monthlySalary} onChange={e=>set("monthlySalary",e.target.value)} placeholder="66000" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Monthly Expenses (₹)"><input type="number" value={p.monthlyExpenses} onChange={e=>set("monthlyExpenses",e.target.value)} placeholder="35000" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Current Savings (₹)"><input type="number" value={p.savings} onChange={e=>set("savings",e.target.value)} placeholder="150000" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Total Debt (₹)"><input type="number" value={p.totalDebt} onChange={e=>set("totalDebt",e.target.value)} placeholder="0" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Monthly EMI (₹)"><input type="number" value={p.monthlyEMI} onChange={e=>set("monthlyEMI",e.target.value)} placeholder="0" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
                <F label="Credit Score"><input type="number" value={p.creditScore} onChange={e=>set("creditScore",e.target.value)} placeholder="700" min="300" max="900" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/></F>
              </div>
            </div>
          )}

          {step===3&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <label style={lbl}>Select your life goals (choose all that apply)</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8}} className="mobile-grid-1">
                  {GOALS.map(g=>{
                    const active=p.goals.includes(g.id);
                    return(
                      <div key={g.id} onClick={()=>tog(g.id)} style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",background:active?"rgba(108,99,255,0.18)":"rgba(255,255,255,0.02)",border:active?"1px solid rgba(108,99,255,0.5)":"1px solid rgba(255,255,255,0.06)",transition:"all 0.2s",fontSize:14,color:active?"#A5B4FC":"#94A3B8",display:"flex",alignItems:"center",gap:8,fontWeight:active?600:400}}>
                        {active&&<span style={{color:"#22C55E"}}>✓</span>}{g.label}
                      </div>
                    );
                  })}
                </div>
              </div>
              <F label="Target retirement age">
                <input type="number" value={p.targetRetirementAge} onChange={e=>set("targetRetirementAge",e.target.value)} placeholder="55" min="35" max="65" style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/>
              </F>
            </div>
          )}

          {err&&<div style={{marginTop:16,padding:"10px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {err}</div>}

          <div style={{display:"flex",justifyContent:"space-between",marginTop:28,gap:12}}>
            {step>0?(
              <button onClick={back} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#CBD5E1",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
            ):<div/>}
            {step<STEPS.length-1?(
              <button onClick={next} style={{background:"linear-gradient(135deg,#6C63FF,#4F46E5)",border:"none",color:"white",borderRadius:12,padding:"12px 32px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 0 20px rgba(108,99,255,0.3)",fontFamily:"inherit"}}>Continue →</button>
            ):(
              <button onClick={finish} disabled={ld} style={{background:"linear-gradient(135deg,#22C55E,#16A34A)",border:"none",color:"white",borderRadius:12,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:ld?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",opacity:ld?.7:1}}>
                {ld?<><span className="aspin" style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block"}}/>Saving…</>:"🚀 Go to Dashboard"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
