import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Logo = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 30,28 2,28" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="16,8 25,26 7,26" fill="#6C63FF" opacity="0.3"/>
      <circle cx="16" cy="16" r="3" fill="#38BDF8"/>
    </svg>
    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#F1F5F9"}}>
      LifePath <span style={{color:"#6C63FF"}}>AI</span>
    </span>
  </div>
);

export default function Navbar({ activePage, onNavigate }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    {id:"home",     label:"Home"},
    {id:"features", label:"Features"},
    {id:"how",      label:"How It Works"},
    {id:"pricing",  label:"Pricing"},
    {id:"about",    label:"About"},
  ];

  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(8,8,20,0.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(108,99,255,0.12)",padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>onNavigate("home")}><Logo/></div>

        {/* Desktop links */}
        <div className="hide-mobile" style={{display:"flex",gap:28}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>onNavigate(l.id)} style={{background:"none",border:"none",color:activePage===l.id?"#F1F5F9":"#94A3B8",fontSize:14,fontWeight:activePage===l.id?600:400,cursor:"pointer",borderBottom:activePage===l.id?"2px solid #6C63FF":"2px solid transparent",paddingBottom:2,transition:"all 0.2s"}}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {user ? (
            <>
              <button onClick={()=>onNavigate("dashboard")} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",fontSize:13,fontWeight:700,cursor:"pointer",padding:"9px 18px",borderRadius:10}}>
                Dashboard
              </button>
              <button onClick={()=>{signOut();onNavigate("home");}} className="hide-mobile" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#CBD5E1",fontSize:13,cursor:"pointer",padding:"9px 16px",borderRadius:10}}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={()=>onNavigate("signin")} className="hide-mobile" style={{background:"none",border:"none",color:"#CBD5E1",fontSize:14,cursor:"pointer",padding:"9px 14px"}}>
                Sign In
              </button>
              <button onClick={()=>onNavigate("signup")} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",fontSize:13,fontWeight:700,cursor:"pointer",padding:"9px 18px",borderRadius:10}}>
                Get Started
              </button>
            </>
          )}
          {/* Mobile menu toggle */}
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"1px solid rgba(108,99,255,0.3)",color:"#A5B4FC",cursor:"pointer",padding:"8px 10px",borderRadius:8,fontSize:18,display:"none"}} className="show-mobile">
            {menuOpen?"✕":"☰"}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{position:"fixed",top:62,left:0,right:0,zIndex:199,background:"rgba(8,8,20,0.98)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(108,99,255,0.15)",padding:"20px 24px",display:"flex",flexDirection:"column",gap:12}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>{onNavigate(l.id);setMenuOpen(false);}} style={{background:"none",border:"none",color:"#CBD5E1",fontSize:15,fontWeight:500,cursor:"pointer",textAlign:"left",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              {l.label}
            </button>
          ))}
          {!user && (
            <button onClick={()=>{onNavigate("signin");setMenuOpen(false);}} style={{background:"rgba(108,99,255,0.15)",border:"1px solid rgba(108,99,255,0.3)",color:"#A5B4FC",fontSize:14,cursor:"pointer",padding:"12px",borderRadius:10,marginTop:8,fontWeight:600}}>
              Sign In
            </button>
          )}
        </div>
      )}

      <style>{`.show-mobile{display:none!important} @media(max-width:768px){.show-mobile{display:flex!important}}`}</style>
    </>
  );
}
