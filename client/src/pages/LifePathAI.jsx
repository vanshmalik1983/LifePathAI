import { useState, useEffect } from "react";

// ── Icons ─────────────────────────────────────────────────
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <polygon points="16,2 30,28 2,28" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinejoin="round"/>
    <polygon points="16,8 25,26 7,26" fill="#6C63FF" opacity="0.3"/>
    <circle cx="16" cy="16" r="3" fill="#38BDF8"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckIcon = ({ color = "#22C55E" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6.5" fill={color} opacity="0.2"/>
    <path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Mini Chart ────────────────────────────────────────────
const MiniChart = ({ color = "#22C55E" }) => {
  const pts = "0,30 15,25 30,20 45,15 60,8 75,5";
  const g = `chartGrad${color.replace("#","")}`;
  return (
    <svg width="80" height="35" viewBox="0 0 80 35">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${pts} 75,35 0,35`} fill={`url(#${g})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ── Animated Brain ────────────────────────────────────────
const BrainSVG = () => (
  <svg viewBox="0 0 400 400" style={{ width:"100%", maxWidth:460, filter:"drop-shadow(0 0 40px #6C63FF88)" }}>
    <defs>
      <radialGradient id="bGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6C63FF" stopOpacity="0.4"/><stop offset="100%" stopColor="#0F0F1A" stopOpacity="0"/></radialGradient>
      <radialGradient id="bFill" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#4F46E5"/><stop offset="60%" stopColor="#312E81"/><stop offset="100%" stopColor="#1E1B4B"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="200" cy="200" r="190" fill="url(#bGlow)"/>
    <path d="M200 80 C240 70 290 90 310 130 C330 165 325 200 310 225 C340 240 355 270 340 295 C325 320 295 330 265 320 C250 340 225 350 200 345 C175 350 150 340 135 320 C105 330 75 320 60 295 C45 270 60 240 90 225 C75 200 70 165 90 130 C110 90 160 70 200 80Z" fill="url(#bFill)" stroke="#6C63FF" strokeWidth="1.5"/>
    <path d="M155 120 C165 110 180 115 185 130 C190 145 175 155 165 165 C155 175 160 185 170 190" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <path d="M215 120 C225 110 240 115 245 130 C250 145 235 155 225 165 C215 175 220 185 230 190" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <path d="M130 190 C145 180 160 185 165 200 C170 215 155 225 145 235" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <path d="M270 190 C255 180 240 185 235 200 C230 215 245 225 255 235" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.7"/>
    <rect x="170" y="170" width="60" height="60" rx="10" fill="#1E40AF" stroke="#38BDF8" strokeWidth="1.5"/>
    <rect x="175" y="175" width="50" height="50" rx="8" fill="#1D4ED8" opacity="0.5"/>
    <text x="200" y="207" textAnchor="middle" fill="#E0F2FE" fontSize="22" fontWeight="bold" fontFamily="monospace">AI</text>
    {[[120,150],[280,150],[100,240],[300,240],[170,310],[230,310]].map(([cx,cy],i)=>(
      <g key={i}>
        <circle cx={cx} cy={cy} r="5" fill="#38BDF8" opacity="0.9" filter="url(#glow)"><animate attributeName="opacity" values="0.9;0.3;0.9" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/></circle>
        <circle cx={cx} cy={cy} r="10" fill="#38BDF8" opacity="0.2"><animate attributeName="r" values="8;14;8" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/></circle>
      </g>
    ))}
    <path d="M200 200 L120 150 M200 200 L280 150 M200 200 L100 240 M200 200 L300 240 M200 200 L170 310 M200 200 L230 310" stroke="#38BDF8" strokeWidth="0.8" opacity="0.35"/>
    {[[60,60],[340,80],[50,300],[360,280],[200,30],[200,370]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="2" fill="white" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur={`${2+i*0.5}s`} repeatCount="indefinite"/></circle>
    ))}
  </svg>
);

// ── Feature Card ──────────────────────────────────────────
const FeatureCard = ({ emoji, title, desc, accent, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:hovered?`rgba(${accent},0.12)`:"rgba(15,15,35,0.7)", border:`1px solid rgba(${accent},${hovered?0.5:0.2})`, borderRadius:18, padding:"28px 24px", cursor:"pointer", transition:"all 0.3s ease", transform:hovered?"translateY(-4px)":"none", boxShadow:hovered?`0 16px 40px rgba(${accent},0.15)`:"0 4px 16px rgba(0,0,0,0.2)" }}>
      <div style={{fontSize:48,marginBottom:16}}>{emoji}</div>
      <div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",marginBottom:10}}>{title}</div>
      <div style={{fontSize:14,color:"#94A3B8",lineHeight:1.6,marginBottom:20}}>{desc}</div>
      <button onClick={onClick} style={{background:"none",border:"none",color:`rgb(${accent})`,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:0}}>
        Learn more <ArrowRight/>
      </button>
    </div>
  );
};

// ── Floating Card ─────────────────────────────────────────
const FCard = ({ style, children }) => (
  <div style={{ position:"absolute", background:"rgba(15,15,35,0.85)", backdropFilter:"blur(12px)", border:"1px solid rgba(108,99,255,0.3)", borderRadius:14, padding:"12px 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", ...style }}>
    {children}
  </div>
);

// ── Preview panels ────────────────────────────────────────
const DashPreview = () => (
  <div style={{background:"#0D0D1F",borderRadius:12,padding:14,fontSize:11}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:"#CBD5E1",fontWeight:600}}>Overview</span><span style={{color:"#64748B"}}>This Month ▾</span></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
      {[["Net Worth","₹6.87L","+8.2%"],["Goals","3/5","On Track"],["Savings","₹10,400","+12%"]].map(([l,v,s])=>(
        <div key={l} style={{background:"#13132B",borderRadius:8,padding:"7px 8px"}}>
          <div style={{color:"#64748B",fontSize:9,marginBottom:2}}>{l}</div>
          <div style={{color:"#F1F5F9",fontWeight:700,fontSize:12}}>{v}</div>
          <div style={{color:"#22C55E",fontSize:9}}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{color:"#22C55E",fontWeight:700,marginBottom:4,fontSize:12}}>₹6.87L <span style={{fontSize:10}}>+15.4%</span></div>
    <MiniChart color="#22C55E"/>
  </div>
);

const AIPreview = () => (
  <div style={{background:"#0D0D1F",borderRadius:12,padding:14,fontSize:11}}>
    <div style={{color:"#CBD5E1",fontWeight:600,marginBottom:10}}>Analysis</div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div style={{position:"relative",width:52,height:52}}>
        <svg viewBox="0 0 52 52" style={{transform:"rotate(-90deg)"}}>
          <circle cx="26" cy="26" r="22" fill="none" stroke="#1E293B" strokeWidth="5"/>
          <circle cx="26" cy="26" r="22" fill="none" stroke="#6C63FF" strokeWidth="5" strokeDasharray={`${2*Math.PI*22*0.9} ${2*Math.PI*22}`}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#F1F5F9",fontSize:12}}>90%</div>
      </div>
      <div><div style={{color:"#94A3B8",fontSize:10}}>Career Match</div><div style={{color:"#22C55E",fontWeight:700,fontSize:11}}>Great Match!</div></div>
    </div>
    {[["Software Eng","₹10L"],["Data Scientist","₹9.5L"],["Product Mgr","₹9L"]].map(([r,s])=>(
      <div key={r} style={{display:"flex",justifyContent:"space-between",background:"#13132B",borderRadius:6,padding:"5px 8px",marginBottom:4}}>
        <span style={{color:"#CBD5E1"}}>{r}</span><span style={{color:"#6C63FF",fontWeight:600}}>{s}</span>
      </div>
    ))}
  </div>
);

const LoanPreview = () => (
  <div style={{background:"#0D0D1F",borderRadius:12,padding:14,fontSize:11}}>
    <div style={{color:"#CBD5E1",fontWeight:600,marginBottom:10}}>Debt Overview</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><div style={{color:"#64748B",fontSize:10}}>Total Debt</div><div style={{color:"#F1F5F9",fontWeight:800,fontSize:18}}>₹2.97L</div><div style={{color:"#EF4444",fontSize:10}}>-12.5%</div></div>
      <div style={{position:"relative",width:60,height:60}}>
        <svg viewBox="0 0 60 60" style={{transform:"rotate(-90deg)"}}>
          <circle cx="30" cy="30" r="24" fill="none" stroke="#1E293B" strokeWidth="6"/>
          <circle cx="30" cy="30" r="24" fill="none" stroke="#6C63FF" strokeWidth="6" strokeDasharray={`${2*Math.PI*24*0.35} ${2*Math.PI*24}`}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{color:"#F1F5F9",fontWeight:800,fontSize:12}}>35%</div><div style={{color:"#64748B",fontSize:8}}>Paid</div></div>
      </div>
    </div>
    {["Refinance to lower rate","Extra payment plan","Debt avalanche strategy"].map(r=>(
      <div key={r} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><CheckIcon/><span style={{color:"#CBD5E1"}}>{r}</span></div>
    ))}
  </div>
);

const PDFPreview = () => (
  <div style={{background:"#F8FAFC",borderRadius:12,padding:14,fontSize:11,color:"#0F172A"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div><div style={{fontWeight:800,fontSize:13}}>Your Life Plan Report</div><div style={{color:"#64748B",fontSize:9}}>Generated May 2024</div></div>
      <div style={{background:"#EF4444",color:"white",borderRadius:5,padding:"2px 6px",fontSize:10,fontWeight:700}}>PDF</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
      {[["Net Worth (5yr)","₹2.05Cr"],["Freedom Date","2030"],["Goals","4/5"]].map(([l,v])=>(
        <div key={l}><div style={{color:"#64748B",fontSize:8}}>{l}</div><div style={{fontWeight:700,fontSize:11}}>{v}</div></div>
      ))}
    </div>
    <MiniChart color="#6C63FF"/>
    {["Career growth at 15%/yr","Debt-free in 24 months"].map(h=>(
      <div key={h} style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}><CheckIcon color="#6C63FF"/><span style={{fontSize:10,color:"#374151"}}>{h}</span></div>
    ))}
  </div>
);

// ── Explore Card ──────────────────────────────────────────
const ExploreCard = ({ title, preview:Preview, btnLabel, btnColor, onClick }) => (
  <div style={{background:"rgba(13,13,31,0.8)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:18,overflow:"hidden",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"14px 14px 0"}}>
      <div style={{color:"#94A3B8",fontSize:12,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:7,height:7,borderRadius:"50%",background:btnColor,display:"inline-block"}}/>
        {title}
      </div>
      <Preview/>
    </div>
    <div style={{padding:14,marginTop:"auto"}}>
      <button onClick={onClick} style={{width:"100%",background:btnColor,border:"none",color:"white",borderRadius:10,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {btnLabel} <ArrowRight/>
      </button>
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────
export default function LifePathAI({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = (page) => onNavigate?.(page);

  const features = [
    {emoji:"🧠",title:"Career Guidance 🧠",   desc:"AI analyses your skills and passions to find your perfect career path in India.",    accent:"108,99,255", page:"ai-analysis"},
    {emoji:"💰",title:"Loan Relief 💰",         desc:"Smart strategies to reduce debt, save more, and achieve financial freedom.",          accent:"34,197,94",  page:"loan-relief"},
    {emoji:"📈",title:"Personalised Roadmap 📈",desc:"Step-by-step plans tailored to your goals and Indian financial instruments.",         accent:"56,189,248", page:"finance"},
    {emoji:"📄",title:"PDF Reports 📄",          desc:"Beautiful AI-generated reports and real-time tracking to keep you accountable.",     accent:"251,191,36", page:"pdf-report"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#080814",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9",overflowX:"hidden"}}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .float{animation:float 4s ease-in-out infinite}
        .float2{animation:float2 5s ease-in-out 0.6s infinite}
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(8,8,20,0.95)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?"1px solid rgba(108,99,255,0.15)":"none",transition:"all 0.3s",padding:"0 48px",display:"flex",alignItems:"center",height:62}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:56}}>
          <Logo/>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:"#F1F5F9"}}>LifePath <span style={{color:"#6C63FF"}}>AI</span></span>
        </div>
        <div style={{display:"flex",gap:32,flex:1}}>
          {["Home","Features","How It Works","Pricing","About"].map((item,i)=>(
            <a key={item} href="#" style={{color:i===0?"#F1F5F9":"#94A3B8",fontSize:14,fontWeight:i===0?600:400,textDecoration:"none",borderBottom:i===0?"2px solid #6C63FF":"none",paddingBottom:2}}>{item}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button style={{background:"none",border:"none",color:"#CBD5E1",fontSize:14,cursor:"pointer",padding:"8px 14px"}}>Log in</button>
          <button onClick={()=>nav("dashboard")} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",fontSize:14,fontWeight:700,cursor:"pointer",padding:"10px 20px",borderRadius:10}}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 80px 60px"}}>
        {Array.from({length:50}).map((_,i)=>(
          <div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:Math.random()*2+1,height:Math.random()*2+1,borderRadius:"50%",background:"white",opacity:Math.random()*0.5+0.1,animation:`pulse ${Math.random()*3+2}s ease-in-out ${Math.random()*2}s infinite`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"absolute",top:"10%",left:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.15),transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.1),transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>

        {/* Left */}
        <div style={{flex:1,maxWidth:600,position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(108,99,255,0.15)",border:"1px solid rgba(108,99,255,0.4)",borderRadius:30,padding:"6px 16px",marginBottom:28,fontSize:13,color:"#A5B4FC",fontWeight:500}}>
            ✨ AI-Powered Life Planning
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(38px,5vw,64px)",fontWeight:800,lineHeight:1.1,color:"#F1F5F9",marginBottom:16,letterSpacing:-2}}>
            Simulate, Analyze,<br/>and Achieve Your<br/>
            <span style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dream Life</span> with AI
          </h1>
          <p style={{fontSize:17,color:"#94A3B8",marginBottom:36,lineHeight:1.6}}>Plan your career, finances, and goals all in one place — tailored for India</p>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:44}}>
            <button onClick={()=>nav("dashboard")} style={{background:"linear-gradient(135deg,#6C63FF,#4F46E5)",border:"none",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",padding:"14px 28px",borderRadius:12,display:"flex",alignItems:"center",gap:8,boxShadow:"0 0 30px rgba(108,99,255,0.4)"}}>
              Get Started <ArrowRight/>
            </button>
            <button onClick={()=>nav("chat")} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",color:"#CBD5E1",fontSize:15,cursor:"pointer",padding:"14px 22px",borderRadius:12}}>
              💬 Ask AI
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex"}}>
              {["👨‍💼","👩‍🔬","👨‍🎨","👩‍💻"].map((e,i)=>(
                <div key={i} style={{width:34,height:34,borderRadius:"50%",background:`hsl(${220+i*30},60%,40%)`,border:"2px solid #080814",marginLeft:i===0?0:-10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{e}</div>
              ))}
            </div>
            <div><span style={{fontWeight:700,color:"#F1F5F9"}}>50,000+ users</span><span style={{color:"#64748B",fontSize:13,display:"block"}}>transforming their lives ❤️</span></div>
          </div>
        </div>

        {/* Right - Brain */}
        <div style={{flex:1,position:"relative",display:"flex",justifyContent:"center",alignItems:"center",minHeight:500}}>
          <div className="float" style={{width:"100%",maxWidth:460}}><BrainSVG/></div>
          <FCard style={{top:"8%",left:"2%",minWidth:176}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:3,letterSpacing:1}}>CAREER PATH</div>
            <div style={{fontWeight:700,color:"#F1F5F9"}}>Software Engineer</div>
            <div style={{fontSize:11,color:"#6C63FF",marginBottom:6}}>₹10 LPA · <span style={{color:"#94A3B8"}}>90% match</span></div>
            <div style={{background:"#1E293B",borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:"90%",height:"100%",background:"linear-gradient(90deg,#6C63FF,#38BDF8)"}}/></div>
          </FCard>
          <FCard className="float2" style={{bottom:"20%",left:"5%",minWidth:176}}>
            <div style={{fontSize:10,color:"#64748B",marginBottom:3,letterSpacing:1}}>FINANCIAL FREEDOM</div>
            <div style={{fontWeight:800,fontSize:20,color:"#F1F5F9"}}>₹2.05 Cr</div>
            <div style={{fontSize:10,color:"#64748B",marginBottom:6}}>Net worth in 5 years</div>
            <MiniChart color="#22C55E"/>
          </FCard>
          <FCard style={{top:"5%",right:"0%",minWidth:155}}>
            <div style={{fontSize:10,color:"#64748B",letterSpacing:1,marginBottom:5}}>LIFE PROGRESS</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{position:"relative",width:42,height:42}}>
                <svg viewBox="0 0 42 42" style={{transform:"rotate(-90deg)"}}><circle cx="21" cy="21" r="17" fill="none" stroke="#1E293B" strokeWidth="4"/><circle cx="21" cy="21" r="17" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray={`${2*Math.PI*17*0.78} ${2*Math.PI*17}`}/></svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#F1F5F9"}}>78%</div>
              </div>
              <div style={{fontSize:10,color:"#22C55E"}}>+12% this month</div>
            </div>
          </FCard>
          <FCard style={{bottom:"25%",right:"0%",minWidth:155}}>
            <div style={{fontSize:10,color:"#64748B",letterSpacing:1,marginBottom:7}}>GOALS</div>
            {["Buy Home","Debt Free","Early Retirement"].map(g=>(
              <div key={g} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><CheckIcon/><span style={{color:"#CBD5E1",fontSize:12}}>{g}</span></div>
            ))}
          </FCard>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{padding:"40px 80px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>
          {features.map(f=><FeatureCard key={f.title} {...f} onClick={()=>nav(f.page)}/>)}
        </div>
      </section>

      {/* ── Explore ── */}
      <section style={{padding:"20px 80px 60px"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <div style={{fontSize:13,color:"#6C63FF",letterSpacing:3,fontWeight:600,marginBottom:10}}>✦ Explore LifePath AI ✦</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:34,fontWeight:800,color:"#F1F5F9",letterSpacing:-1,marginBottom:10}}>Explore LifePath AI</h2>
          <p style={{color:"#64748B",fontSize:15}}>Powerful tools, Smart insights, Real results.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
          <ExploreCard title="Dashboard"   preview={DashPreview}  btnLabel="Explore Dashboard"  btnColor="#6C63FF" onClick={()=>nav("dashboard")}/>
          <ExploreCard title="AI Analysis" preview={AIPreview}    btnLabel="See Analysis"        btnColor="#4F46E5" onClick={()=>nav("ai-analysis")}/>
          <ExploreCard title="Loan Relief" preview={LoanPreview}  btnLabel="Explore Loan Relief" btnColor="#22C55E" onClick={()=>nav("loan-relief")}/>
          <ExploreCard title="PDF Report"  preview={PDFPreview}   btnLabel="Download Report"     btnColor="#F59E0B" onClick={()=>nav("pdf-report")}/>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{margin:"0 80px 60px",background:"rgba(13,13,31,0.8)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:20,padding:"28px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
        <div style={{display:"flex",gap:44,flexWrap:"wrap"}}>
          {[["🛡","Secure & Private","Your data is 100% protected"],["👥","50,000+","Active Users"],["⭐","4.9/5","User Rating"],["⚡","AI-Powered","Smart & Reliable"]].map(([icon,val,sub])=>(
            <div key={val} style={{textAlign:"center"}}>
              <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:18,fontWeight:800,color:"#F1F5F9"}}>{val}</div>
              <div style={{fontSize:11,color:"#64748B"}}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
          <button onClick={()=>nav("dashboard")} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",padding:"15px 30px",borderRadius:12,display:"flex",alignItems:"center",gap:10,boxShadow:"0 0 30px rgba(108,99,255,0.4)"}}>
            Start Your Free Journey <ArrowRight/>
          </button>
          <span style={{color:"#64748B",fontSize:12}}>No credit card required</span>
        </div>
      </section>
    </div>
  );
}
