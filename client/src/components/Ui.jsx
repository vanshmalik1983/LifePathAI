import { useState } from "react";
export { Spinner, Card, Btn, Input, Select, Ring, Badge, ProgressBar, SectionHeader, ScoreGauge, LoadingCard, EmptyState, CheckRow, Tabs };
const fmt = n => {
  if(!n&&n!==0)return"—";
  if(n>=10000000)return`₹${(n/10000000).toFixed(1)}Cr`;
  if(n>=100000)return`₹${(n/100000).toFixed(1)}L`;
  return`₹${Math.round(n).toLocaleString("en-IN")}`;
};
export { fmt };

export const Card = ({children,style={},className=""}) => (
  <div className={`glass ${className}`} style={{padding:24,...style}}>{children}</div>
);

export const StatCard = ({label,value,sub,subColor="#22C55E",icon,style={}}) => (
  <Card style={{...style}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <div style={{fontSize:11,color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:.8}}>{label}</div>
      {icon&&<span style={{fontSize:22}}>{icon}</span>}
    </div>
    <div style={{fontSize:26,fontWeight:800,color:"#F1F5F9",fontFamily:"'Syne',sans-serif",letterSpacing:-.5,marginBottom:4}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:subColor,fontWeight:600}}>{sub}</div>}
  </Card>
);

export const Ring = ({value,size=80,stroke=7,color="#6C63FF",label,sublabel}) => {
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, dash=(Math.min(value,100)/100)*circ;
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E293B" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        {label&&<div style={{fontSize:size>70?15:11,fontWeight:800,color:"#F1F5F9",lineHeight:1}}>{label}</div>}
        {sublabel&&<div style={{fontSize:9,color:"#64748B",marginTop:2}}>{sublabel}</div>}
      </div>
    </div>
  );
};

export const ProgressBar = ({value,color="#6C63FF",height=6,style={}}) => (
  <div style={{background:"#1E293B",borderRadius:height,height,overflow:"hidden",...style}}>
    <div style={{width:`${Math.min(value,100)}%`,height:"100%",background:color,borderRadius:height,transition:"width 1s ease"}}/>
  </div>
);

export const Badge = ({children,color="#6C63FF",style={}}) => (
  <span style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,whiteSpace:"nowrap",...style}}>
    {children}
  </span>
);

export const Btn = ({children,variant="primary",onClick,style={},icon,disabled=false,loading=false,type="button",className=""}) => {
  const [h,sH]=useState(false);
  const V={
    primary:{background:disabled?"#374151":h?"#7C73FF":"linear-gradient(135deg,#6C63FF,#4F46E5)",color:"white",boxShadow:h&&!disabled?"0 0 24px rgba(108,99,255,0.5)":"none"},
    ghost:{background:h?"rgba(108,99,255,0.15)":"transparent",color:"#A5B4FC",border:"1px solid rgba(108,99,255,0.3)"},
    success:{background:h?"#16A34A":"linear-gradient(135deg,#22C55E,#16A34A)",color:"white"},
    danger:{background:h?"#DC2626":"rgba(239,68,68,0.15)",color:"#FCA5A5",border:"1px solid rgba(239,68,68,0.3)"},
    secondary:{background:h?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.06)",color:"#CBD5E1",border:"1px solid rgba(255,255,255,0.1)"},
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled||loading}
      onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} className={className}
      style={{border:"none",cursor:disabled||loading?"not-allowed":"pointer",borderRadius:12,padding:"11px 20px",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",whiteSpace:"nowrap",opacity:disabled?.5:1,...V[variant],...style}}>
      {loading?<span className="aspin" style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block"}}/>:icon&&<span>{icon}</span>}
      {children}
    </button>
  );
};

export const Input = ({label,prefix,suffix,error,style={},inputStyle={},...props}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:"#94A3B8",textTransform:"uppercase",letterSpacing:.5}}>{label}</label>}
    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
      {prefix&&<span style={{position:"absolute",left:12,color:"#64748B",fontSize:14,pointerEvents:"none"}}>{prefix}</span>}
      <input {...props} style={{width:"100%",background:"rgba(15,15,35,0.8)",border:`1px solid ${error?"#EF4444":"rgba(108,99,255,0.2)"}`,borderRadius:10,padding:`12px ${suffix?40:14}px 12px ${prefix?36:14}px`,color:"#F1F5F9",fontSize:14,outline:"none",transition:"border-color 0.2s",...inputStyle}}
        onFocus={e=>e.target.style.borderColor="#6C63FF"}
        onBlur={e=>e.target.style.borderColor=error?"#EF4444":"rgba(108,99,255,0.2)"}/>
      {suffix&&<span style={{position:"absolute",right:12,color:"#64748B",fontSize:13}}>{suffix}</span>}
    </div>
    {error&&<span style={{fontSize:11,color:"#EF4444"}}>{error}</span>}
  </div>
);

export const Select = ({label,options=[],style={},...props}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:"#94A3B8",textTransform:"uppercase",letterSpacing:.5}}>{label}</label>}
    <select {...props} style={{width:"100%",background:"rgba(15,15,35,0.8)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:10,padding:"12px 14px",color:"#F1F5F9",fontSize:14,outline:"none",cursor:"pointer",appearance:"none"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export const SectionHeader = ({title,sub,action}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
    <div>
      <div style={{fontSize:18,fontWeight:700,color:"#F1F5F9",fontFamily:"'Syne',sans-serif"}}>{title}</div>
      {sub&&<div style={{fontSize:13,color:"#64748B",marginTop:2}}>{sub}</div>}
    </div>
    {action}
  </div>
);

export const ScoreGauge = ({score,label,size=120}) => {
  const c=score>=80?"#22C55E":score>=60?"#FBBF24":score>=40?"#F97316":"#EF4444";
  const l=score>=80?"Excellent":score>=60?"Good":score>=40?"Fair":"Poor";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}} className="abounce">
      <Ring value={score} size={size} stroke={10} color={c} label={`${score}`} sublabel="/100"/>
      <div style={{fontSize:13,fontWeight:700,color:c}}>{l}</div>
      {label&&<div style={{fontSize:12,color:"#64748B"}}>{label}</div>}
    </div>
  );
};

export const LoadingCard = ({lines=4,style={}}) => (
  <Card style={{...style}}>
    {Array.from({length:lines}).map((_,i)=>(
      <div key={i} className="skel" style={{height:16,marginBottom:12,width:i%2===0?"100%":"70%"}}/>
    ))}
  </Card>
);

export const EmptyState = ({icon,title,sub,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px",color:"#64748B"}}>
    {icon&&<div style={{fontSize:56,marginBottom:16}}>{icon}</div>}
    <div style={{fontSize:18,fontWeight:700,color:"#94A3B8",marginBottom:8}}>{title}</div>
    {sub&&<div style={{fontSize:14,marginBottom:24}}>{sub}</div>}
    {action}
  </div>
);

export const CheckRow = ({children,color="#22C55E"}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
    <div style={{width:20,height:20,borderRadius:"50%",background:`${color}22`,border:`1px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
    </div>
    <span style={{fontSize:14,color:"#CBD5E1",lineHeight:1.5}}>{children}</span>
  </div>
);

export const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:4,background:"rgba(13,13,31,0.9)",border:"1px solid rgba(108,99,255,0.15)",borderRadius:12,padding:4,flexWrap:"wrap"}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{background:active===t.id?"rgba(108,99,255,0.25)":"transparent",border:active===t.id?"1px solid rgba(108,99,255,0.4)":"1px solid transparent",color:active===t.id?"#A5B4FC":"#64748B",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
        {t.icon&&<span style={{marginRight:6}}>{t.icon}</span>}{t.label}
      </button>
    ))}
  </div>
);

export const Spinner = () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
    <div className="aspin" style={{width:40,height:40,border:"3px solid rgba(108,99,255,0.2)",borderTop:"3px solid #6C63FF",borderRadius:"50%"}}/>
  </div>
);
