import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

// ── Mini components ───────────────────────────────────────
const GBtn = ({children,onClick,style={}}) => (
  <button onClick={onClick} style={{background:"linear-gradient(135deg,#6C63FF,#4F46E5)",border:"none",color:"white",fontWeight:700,fontSize:15,padding:"14px 28px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 28px rgba(108,99,255,0.4)",display:"flex",alignItems:"center",gap:8,...style}}>
    {children}
  </button>
);
const Check = ({color="#22C55E"}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill={color} opacity="0.2"/><path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const MiniChart = ({color="#22C55E"}) => {
  const pts="0,30 15,25 30,20 45,15 60,8 75,5";
  const id=`g${color.replace("#","")}`;
  return (<svg width="80" height="35" viewBox="0 0 80 35"><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><polygon points={`0,30 ${pts} 75,35 0,35`} fill={`url(#${id})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
};

// Animated brain
const Brain = () => (
  <svg viewBox="0 0 400 400" style={{width:"100%",maxWidth:460,filter:"drop-shadow(0 0 40px #6C63FF88)"}}>
    <defs>
      <radialGradient id="bG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6C63FF" stopOpacity="0.4"/><stop offset="100%" stopColor="#0F0F1A" stopOpacity="0"/></radialGradient>
      <radialGradient id="bF" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#4F46E5"/><stop offset="60%" stopColor="#312E81"/><stop offset="100%" stopColor="#1E1B4B"/></radialGradient>
      <filter id="gl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="200" cy="200" r="190" fill="url(#bG)"/>
    <path d="M200 80 C240 70 290 90 310 130 C330 165 325 200 310 225 C340 240 355 270 340 295 C325 320 295 330 265 320 C250 340 225 350 200 345 C175 350 150 340 135 320 C105 330 75 320 60 295 C45 270 60 240 90 225 C75 200 70 165 90 130 C110 90 160 70 200 80Z" fill="url(#bF)" stroke="#6C63FF" strokeWidth="1.5"/>
    <path d="M155 120 C165 110 180 115 185 130 C190 145 175 155 165 165 C155 175 160 185 170 190" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <path d="M215 120 C225 110 240 115 245 130 C250 145 235 155 225 165 C215 175 220 185 230 190" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <path d="M175 250 C185 240 200 242 210 252 C220 262 215 275 205 280" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <rect x="170" y="170" width="60" height="60" rx="10" fill="#1E40AF" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="200" y="207" textAnchor="middle" fill="#E0F2FE" fontSize="22" fontWeight="bold" fontFamily="monospace">AI</text>
    {[[120,150],[280,150],[100,240],[300,240],[170,310],[230,310]].map(([cx,cy],i)=>(
      <g key={i}>
        <circle cx={cx} cy={cy} r="5" fill="#38BDF8" opacity="0.9" filter="url(#gl)"><animate attributeName="opacity" values="0.9;0.3;0.9" dur={`${1.5+i*.3}s`} repeatCount="indefinite"/></circle>
        <circle cx={cx} cy={cy} r="10" fill="#38BDF8" opacity="0.2"><animate attributeName="r" values="8;14;8" dur={`${1.5+i*.3}s`} repeatCount="indefinite"/></circle>
      </g>
    ))}
    <path d="M200 200 L120 150 M200 200 L280 150 M200 200 L100 240 M200 200 L300 240 M200 200 L170 310 M200 200 L230 310" stroke="#38BDF8" strokeWidth="0.8" opacity="0.35"/>
    {[[60,60],[340,80],[50,300],[360,280]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="2" fill="white" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur={`${2+i*.5}s`} repeatCount="indefinite"/></circle>
    ))}
  </svg>
);

const FCard = ({style,children}) => (
  <div style={{position:"absolute",background:"rgba(10,10,28,0.9)",backdropFilter:"blur(12px)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:14,padding:"12px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",...style}}>{children}</div>
);

export default function HomePage({ onNavigate }) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);

  const features = [
    {emoji:"🧠",title:"Career Guidance",   desc:"AI finds your best career path in India based on your skills, salary & goals.",  accent:"108,99,255",page:"ai-analysis"},
    {emoji:"💰",title:"Loan Relief",        desc:"Get 3 personalised debt payoff strategies based on your actual salary & EMIs.",   accent:"34,197,94", page:"loan-relief"},
    {emoji:"📈",title:"Finance Planning",   desc:"Personalised SIP, PPF, ELSS recommendations for your income and risk profile.",   accent:"56,189,248",page:"finance"},
    {emoji:"📄",title:"PDF Life Reports",   desc:"AI-generated life plan reports you can download, print, or share with your CA.",  accent:"251,191,36",page:"pdf-report"},
  ];

  const testimonials = [
    {name:"Rahul M.",city:"Bangalore",text:"LifePath AI found I was wasting ₹18k/month on unnecessary expenses. The loan avalanche strategy saved me ₹2.4L in interest.",emoji:"👨‍💻",stars:5},
    {name:"Priya S.",city:"Mumbai",   text:"The career analysis showed I was 15% underpaid for my skillset. Got a 32% hike at my new company following the roadmap.",emoji:"👩‍🔬",stars:5},
    {name:"Kiran R.",city:"Hyderabad",text:"Finally understand how to save for my home AND my child's education simultaneously. The goals planner is brilliant.",emoji:"👨‍🏫",stars:5},
  ];

  return (
    <div style={{background:"#080814",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9",overflowX:"hidden"}}>
      <style>{`.float{animation:float 4s ease-in-out infinite}.float2{animation:float 5s ease-in-out .6s infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <Navbar activePage="home" onNavigate={onNavigate}/>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 6% 60px",gap:40}}>
        {/* BG stars */}
        {Array.from({length:40}).map((_,i)=>(
          <div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:Math.random()*2+1,height:Math.random()*2+1,borderRadius:"50%",background:"white",opacity:Math.random()*.5+.1,animation:`pulse ${Math.random()*3+2}s ease-in-out ${Math.random()*2}s infinite`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"absolute",top:"10%",left:"3%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.15),transparent 70%)",filter:"blur(50px)",pointerEvents:"none"}}/>

        {/* Left */}
        <div style={{flex:1,maxWidth:580,position:"relative",zIndex:2}}>
          <div className="au" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(108,99,255,0.15)",border:"1px solid rgba(108,99,255,0.4)",borderRadius:30,padding:"6px 16px",marginBottom:24,fontSize:13,color:"#A5B4FC",fontWeight:500}}>
            ✨ AI-Powered Life Planning for India
          </div>
          <h1 className="au1" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(36px,5vw,62px)",fontWeight:800,lineHeight:1.1,color:"#F1F5F9",marginBottom:16,letterSpacing:-2}}>
            Simulate, Analyze,<br/>and Achieve Your<br/>
            <span style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dream Life</span> with AI
          </h1>
          <p className="au2" style={{fontSize:17,color:"#94A3B8",marginBottom:36,lineHeight:1.6}}>
            Plan your career, finances, and goals — tailored for Indian salaries, taxes, and opportunities.
          </p>
          <div className="au3" style={{display:"flex",gap:14,alignItems:"center",marginBottom:44,flexWrap:"wrap"}}>
            <GBtn onClick={()=>onNavigate(user?"dashboard":"signup")}>
              {user?"Open Dashboard →":"Get Started Free →"}
            </GBtn>
            <button onClick={()=>onNavigate("how")} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",color:"#CBD5E1",fontSize:15,cursor:"pointer",padding:"14px 22px",borderRadius:12,fontFamily:"inherit"}}>
              How it works
            </button>
          </div>
          <div className="au4" style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex"}}>
              {["👨‍💼","👩‍🔬","👨‍🎨","👩‍💻"].map((e,i)=>(
                <div key={i} style={{width:34,height:34,borderRadius:"50%",background:`hsl(${220+i*30},60%,40%)`,border:"2px solid #080814",marginLeft:i===0?0:-10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{e}</div>
              ))}
            </div>
            <div>
              <span style={{fontWeight:700,color:"#F1F5F9"}}>50,000+ users</span>
              <span style={{color:"#64748B",fontSize:13,display:"block"}}>transforming their lives ❤️</span>
            </div>
          </div>
        </div>

        {/* Right – Brain */}
        <div style={{flex:1,position:"relative",display:"flex",justifyContent:"center",alignItems:"center",minHeight:480}} className="hide-mobile">
          <div className="float" style={{width:"100%",maxWidth:440}}><Brain/></div>
          <FCard style={{top:"8%",left:"2%",minWidth:176}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:3,letterSpacing:1}}>CAREER PATH</div>
            <div style={{fontWeight:700,color:"#F1F5F9",fontSize:14}}>Software Engineer</div>
            <div style={{fontSize:11,color:"#6C63FF",marginBottom:6}}>₹10 LPA · <span style={{color:"#94A3B8"}}>90% match</span></div>
            <div style={{background:"#1E293B",borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:"90%",height:"100%",background:"linear-gradient(90deg,#6C63FF,#38BDF8)"}}/></div>
          </FCard>
          <FCard className="float2" style={{bottom:"20%",left:"4%",minWidth:176}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:3,letterSpacing:1}}>FINANCIAL FREEDOM</div>
            <div style={{fontWeight:800,fontSize:20,color:"#F1F5F9"}}>₹2.05 Cr</div>
            <div style={{fontSize:10,color:"#64748B",marginBottom:6}}>Net worth in 5 years</div>
            <MiniChart color="#22C55E"/>
          </FCard>
          <FCard style={{top:"5%",right:"0%",minWidth:155}}>
            <div style={{fontSize:10,color:"#64748B",letterSpacing:1,marginBottom:5}}>LIFE PROGRESS</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{position:"relative",width:42,height:42}}>
                <svg viewBox="0 0 42 42" style={{transform:"rotate(-90deg)"}}><circle cx="21" cy="21" r="17" fill="none" stroke="#1E293B" strokeWidth="4"/><circle cx="21" cy="21" r="17" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray={`${2*Math.PI*17*.78} ${2*Math.PI*17}`}/></svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#F1F5F9"}}>78%</div>
              </div>
              <div style={{fontSize:10,color:"#22C55E"}}>+12% this month</div>
            </div>
          </FCard>
          <FCard style={{bottom:"24%",right:"0%",minWidth:155}}>
            <div style={{fontSize:10,color:"#64748B",letterSpacing:1,marginBottom:7}}>GOALS</div>
            {["🏠 Buy Home","✅ Debt Free","🌴 Retire Early"].map(g=>(
              <div key={g} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><Check/><span style={{color:"#CBD5E1",fontSize:12}}>{g}</span></div>
            ))}
          </FCard>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────── */}
      <section style={{padding:"60px 6%"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="au" style={{display:"inline-block",background:"rgba(108,99,255,0.15)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:30,padding:"6px 18px",fontSize:13,color:"#A5B4FC",fontWeight:600,marginBottom:16}}>🛠 Core Features</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,color:"#F1F5F9",letterSpacing:-1}}>Everything to plan your life</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
          {features.map((f,i)=>{
            const [hov,sH]=useState(false);
            return (
              <div key={i} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
                style={{background:hov?`rgba(${f.accent},.12)`:"rgba(15,15,35,.7)",border:`1px solid rgba(${f.accent},${hov?.5:.2})`,borderRadius:18,padding:"28px 24px",cursor:"pointer",transition:"all .3s",transform:hov?"translateY(-4px)":"none",boxShadow:hov?`0 16px 40px rgba(${f.accent},.15)`:"none"}}>
                <div style={{fontSize:44,marginBottom:14}}>{f.emoji}</div>
                <div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>{f.title}</div>
                <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.6,marginBottom:20}}>{f.desc}</p>
                <button onClick={()=>onNavigate(user?f.page:"signup")} style={{background:"none",border:"none",color:`rgb(${f.accent})`,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:0}}>
                  Learn more →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS (mini) ───────────────────── */}
      <section style={{padding:"60px 6%",background:"linear-gradient(180deg,rgba(108,99,255,0.05) 0%,transparent 100%)"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,color:"#F1F5F9",letterSpacing:-1}}>Up and running in minutes</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,maxWidth:900,margin:"0 auto"}}>
          {[
            {n:"1",icon:"✍️",t:"Sign Up",d:"Create your free account in 30 seconds"},
            {n:"2",icon:"👤",t:"Add Your Details",d:"4-step profile: career, salary, savings, goals"},
            {n:"3",icon:"🤖",t:"AI Analyses",d:"Gemini generates personalised insights"},
            {n:"4",icon:"📊",t:"See Dashboard",d:"Real net worth, scores, and action plan"},
          ].map((s,i)=>(
            <div key={i} className={`au${i+1}`} style={{textAlign:"center",padding:"28px 20px",background:"rgba(13,13,31,.8)",border:"1px solid rgba(108,99,255,.15)",borderRadius:16}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 16px",fontWeight:800,color:"white"}}>{s.n}</div>
              <div style={{fontSize:18,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>{s.t}</div>
              <p style={{fontSize:13,color:"#64748B",lineHeight:1.6}}>{s.d}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <GBtn onClick={()=>onNavigate(user?"dashboard":"signup")}>
            {user?"Open Dashboard →":"Start Free →"}
          </GBtn>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section style={{padding:"60px 6%"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,color:"#F1F5F9",letterSpacing:-1}}>Loved by 50,000+ Indians 🇮🇳</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
          {testimonials.map((t,i)=>(
            <div key={i} className={`au${i+1} glass`} style={{padding:28}}>
              <div style={{display:"flex",gap:3,marginBottom:16}}>
                {Array.from({length:t.stars}).map((_,j)=><span key={j} style={{color:"#FBBF24",fontSize:16}}>★</span>)}
              </div>
              <p style={{fontSize:15,color:"#CBD5E1",lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>"{t.text}"</p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.emoji}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9"}}>{t.name}</div>
                  <div style={{fontSize:12,color:"#64748B"}}>📍 {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────── */}
      <section style={{padding:"60px 6% 80px"}}>
        <div style={{background:"linear-gradient(135deg,rgba(108,99,255,0.18),rgba(56,189,248,0.08))",border:"1px solid rgba(108,99,255,0.25)",borderRadius:24,padding:"56px 40px",textAlign:"center"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#F1F5F9",letterSpacing:-1,marginBottom:16}}>
            Your dream life is waiting
          </h2>
          <p style={{fontSize:17,color:"#94A3B8",marginBottom:36,maxWidth:500,margin:"0 auto 36px"}}>
            Join 50,000+ Indians using AI to plan their career, crush their debt, and grow their wealth.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <GBtn onClick={()=>onNavigate(user?"dashboard":"signup")}>
              {user?"Open Dashboard →":"Start Free — No credit card →"}
            </GBtn>
            <button onClick={()=>onNavigate("features")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#CBD5E1",fontSize:15,cursor:"pointer",padding:"14px 24px",borderRadius:12,fontFamily:"inherit"}}>
              See all features
            </button>
          </div>
          <div style={{display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap",marginTop:48}}>
            {[["🛡","Secure & Private","Data encrypted + never sold"],["50K+","Active Users","Across India"],["4.9★","User Rating","On App Store"],["⚡","AI-Powered","Gemini 1.5 Flash"]].map(([icon,val,sub])=>(
              <div key={val} style={{textAlign:"center"}}>
                <div style={{fontSize:val==="50K+"||val==="4.9★"?22:26,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:18,fontWeight:800,color:"#F1F5F9"}}>{val}</div>
                <div style={{fontSize:11,color:"#64748B"}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"32px 6%",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><polygon points="16,2 30,28 2,28" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinejoin="round"/><circle cx="16" cy="16" r="3" fill="#38BDF8"/></svg>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#F1F5F9"}}>LifePath <span style={{color:"#6C63FF"}}>AI</span></span>
        </div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          {["features","how","pricing","about"].map(p=>(
            <button key={p} onClick={()=>onNavigate(p)} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:13,fontFamily:"inherit",textTransform:"capitalize"}}>{p==="how"?"How It Works":p}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:"#475569"}}>© 2025 LifePath AI · Made with ❤️ in India</div>
      </footer>
    </div>
  );
}
