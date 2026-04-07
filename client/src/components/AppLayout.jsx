import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  {id:"dashboard",   label:"Dashboard",    emoji:"⊞"},
  {id:"ai-analysis", label:"AI Analysis",  emoji:"🧠"},
  {id:"loan-relief", label:"Loan Relief",  emoji:"💰"},
  {id:"finance",     label:"Finance Plan", emoji:"📈"},
  {id:"goals",       label:"Goals",        emoji:"🎯"},
  {id:"pdf-report",  label:"PDF Report",   emoji:"📄"},
  {id:"chat",        label:"AI Chat",      emoji:"💬"},
];

export default function AppLayout({ active, onNavigate, children }) {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => { onNavigate(id); setMobileOpen(false); };

  const SideContent = () => (
    <>
      <div onClick={()=>handleNav("home")} style={{padding:collapsed?"18px 14px":"18px 22px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(108,99,255,0.1)",cursor:"pointer",flexShrink:0}}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
          <polygon points="16,2 30,28 2,28" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinejoin="round"/>
          <polygon points="16,8 25,26 7,26" fill="#6C63FF" opacity="0.3"/>
          <circle cx="16" cy="16" r="3" fill="#38BDF8"/>
        </svg>
        {!collapsed&&<span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,whiteSpace:"nowrap",color:"#F1F5F9"}}>LifePath <span style={{color:"#6C63FF"}}>AI</span></span>}
      </div>
      <nav style={{flex:1,padding:"10px",overflowY:"auto"}}>
        {NAV.map(item=>{
          const isActive=active===item.id;
          return (
            <button key={item.id} onClick={()=>handleNav(item.id)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:collapsed?"10px":"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:isActive?"rgba(108,99,255,0.18)":"transparent",color:isActive?"#A5B4FC":"#64748B",fontSize:14,fontWeight:isActive?700:400,marginBottom:3,transition:"all 0.2s",justifyContent:collapsed?"center":"flex-start",borderLeft:isActive?"3px solid #6C63FF":"3px solid transparent"}}>
              <span style={{fontSize:17,flexShrink:0}}>{item.emoji}</span>
              {!collapsed&&<span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      {!collapsed&&(
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(108,99,255,0.1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,fontWeight:800,color:"white"}}>
              {user?.name?.[0]?.toUpperCase()||"U"}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"#F1F5F9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"User"}</div>
              <div style={{fontSize:11,color:"#475569"}}>Pro Plan</div>
            </div>
          </div>
          <button onClick={()=>{signOut();onNavigate("home");}} style={{width:"100%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#FCA5A5",borderRadius:8,padding:"8px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            Sign Out
          </button>
        </div>
      )}
      <button onClick={()=>setCollapsed(!collapsed)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",padding:"12px",textAlign:"center",fontSize:16,borderTop:"1px solid rgba(108,99,255,0.08)",flexShrink:0}} className="hide-mobile">
        {collapsed?"→":"←"}
      </button>
    </>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#080814"}}>
      {/* Desktop sidebar */}
      <aside className="hide-mobile" style={{width:collapsed?64:220,flexShrink:0,background:"rgba(8,8,22,0.98)",backdropFilter:"blur(20px)",borderRight:"1px solid rgba(108,99,255,0.12)",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",transition:"width 0.3s ease",overflow:"hidden"}}>
        <SideContent/>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
          <div style={{width:260,background:"rgba(8,8,22,0.99)",backdropFilter:"blur(20px)",borderRight:"1px solid rgba(108,99,255,0.15)",display:"flex",flexDirection:"column",height:"100vh"}}>
            <SideContent/>
          </div>
          <div onClick={()=>setMobileOpen(false)} style={{flex:1,background:"rgba(0,0,0,0.5)"}}/>
        </div>
      )}

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Topbar */}
        <header style={{padding:"12px 20px",background:"rgba(8,8,22,0.7)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(108,99,255,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {/* Mobile menu btn */}
            <button onClick={()=>setMobileOpen(true)} style={{background:"none",border:"1px solid rgba(108,99,255,0.25)",color:"#A5B4FC",cursor:"pointer",padding:"8px 10px",borderRadius:8,fontSize:16,display:"none"}} className="show-mobile-flex">
              ☰
            </button>
            <div>
              <div style={{fontSize:17,fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:-.5}}>
                {NAV.find(n=>n.id===active)?.emoji} {NAV.find(n=>n.id===active)?.label||"Dashboard"}
              </div>
              <div style={{fontSize:11,color:"#475569"}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
            </div>
          </div>
          <button onClick={()=>handleNav("chat")} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            💬 <span className="hide-mobile">Ask AI</span>
          </button>
        </header>
        <main style={{flex:1,padding:24,overflowY:"auto"}}>
          {children}
        </main>
      </div>
      <style>{`.show-mobile-flex{display:none!important}@media(max-width:768px){.show-mobile-flex{display:flex!important}}`}</style>
    </div>
  );
}
