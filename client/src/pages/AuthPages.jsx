import { useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const inp = {width:"100%",background:"rgba(15,15,35,0.8)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:12,padding:"13px 16px",color:"#F1F5F9",fontSize:15,outline:"none",fontFamily:"inherit",transition:"border-color 0.2s"};
const Logo = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:32}}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 30,28 2,28" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="16,8 25,26 7,26" fill="#6C63FF" opacity="0.3"/>
      <circle cx="16" cy="16" r="3" fill="#38BDF8"/>
    </svg>
    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#F1F5F9"}}>LifePath <span style={{color:"#6C63FF"}}>AI</span></span>
  </div>
);
const Bg = () => (
  <>
    <div style={{position:"fixed",top:"15%",left:"10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.12),transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:"10%",right:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.08),transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
  </>
);

export function SignInPage({ onSwitch, onSuccess }) {
  const { signIn } = useAuth();
  const [f,sF] = useState({email:"",password:""});
  const [err,sErr] = useState(""); const [ld,sLd] = useState(false);
  const set = (k,v) => sF(p=>({...p,[k]:v}));
  const handle = async(e) => {
    e.preventDefault(); if(!f.email||!f.password){sErr("Fill all fields");return;}
    sErr(""); sLd(true);
    try { const {user,token}=await api.signin(f); signIn(user,token); onSuccess(user); }
    catch(e){sErr(e.message);}finally{sLd(false);}
  };
  return (
    <div style={{minHeight:"100vh",background:"#080814",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20,position:"relative"}}>
      <Bg/>
      <div className="au glass" style={{width:"100%",maxWidth:440,padding:"44px 40px",position:"relative",zIndex:1}}>
        <Logo/>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#F1F5F9",textAlign:"center",marginBottom:6}}>Welcome back 👋</h1>
        <p style={{fontSize:14,color:"#64748B",textAlign:"center",marginBottom:32}}>Sign in to your life planning dashboard</p>
        <form onSubmit={handle} style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"#94A3B8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Email</label>
            <input type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="alex@example.com" required style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"#94A3B8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Password</label>
            <input type="password" value={f.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" required style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/>
          </div>
          {err&&<div style={{padding:"10px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {err}</div>}
          <button type="submit" disabled={ld} style={{background:"linear-gradient(135deg,#6C63FF,#4F46E5)",border:"none",color:"white",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:ld?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 0 30px rgba(108,99,255,0.3)",opacity:ld?.7:1,marginTop:4,fontFamily:"inherit"}}>
            {ld?<><span className="aspin" style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block"}}/>Signing in…</>:"Sign In →"}
          </button>
        </form>
        <p style={{textAlign:"center",marginTop:24,fontSize:14,color:"#64748B"}}>
          No account?{" "}<button onClick={onSwitch} style={{background:"none",border:"none",color:"#A5B4FC",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Create one →</button>
        </p>
      </div>
    </div>
  );
}

export function SignUpPage({ onSwitch, onSuccess }) {
  const { signIn } = useAuth();
  const [f,sF] = useState({name:"",email:"",password:"",confirm:""});
  const [err,sErr] = useState(""); const [ld,sLd] = useState(false);
  const set = (k,v) => sF(p=>({...p,[k]:v}));
  const handle = async(e) => {
    e.preventDefault();
    if(!f.name||!f.email||!f.password){sErr("All fields required");return;}
    if(f.password!==f.confirm){sErr("Passwords don't match");return;}
    if(f.password.length<6){sErr("Password must be 6+ characters");return;}
    sErr(""); sLd(true);
    try { const {user,token}=await api.signup({name:f.name,email:f.email,password:f.password}); signIn(user,token); onSuccess(user); }
    catch(e){sErr(e.message);}finally{sLd(false);}
  };
  return (
    <div style={{minHeight:"100vh",background:"#080814",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20,position:"relative"}}>
      <Bg/>
      <div className="au glass" style={{width:"100%",maxWidth:460,padding:"44px 40px",position:"relative",zIndex:1}}>
        <Logo/>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#F1F5F9",textAlign:"center",marginBottom:6}}>Start your journey 🚀</h1>
        <p style={{fontSize:14,color:"#64748B",textAlign:"center",marginBottom:32}}>Create your free account — 30 seconds</p>
        <form onSubmit={handle} style={{display:"flex",flexDirection:"column",gap:14}}>
          {[["name","Full Name","Alex Kumar","text"],["email","Email","alex@example.com","email"]].map(([k,l,ph,t])=>(
            <div key={k}>
              <label style={{fontSize:12,fontWeight:600,color:"#94A3B8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{l}</label>
              <input type={t} value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/>
            </div>
          ))}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["password","Password","Min 6 chars"],["confirm","Confirm","Repeat"]].map(([k,l,ph])=>(
              <div key={k}>
                <label style={{fontSize:12,fontWeight:600,color:"#94A3B8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{l}</label>
                <input type="password" value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required style={inp} onFocus={e=>e.target.style.borderColor="#6C63FF"} onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.2)"}/>
              </div>
            ))}
          </div>
          {err&&<div style={{padding:"10px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,color:"#FCA5A5",fontSize:13}}>⚠️ {err}</div>}
          <button type="submit" disabled={ld} style={{background:"linear-gradient(135deg,#6C63FF,#4F46E5)",border:"none",color:"white",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:ld?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 0 30px rgba(108,99,255,0.3)",opacity:ld?.7:1,marginTop:4,fontFamily:"inherit"}}>
            {ld?<><span className="aspin" style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block"}}/>Creating…</>:"Create Account →"}
          </button>
        </form>
        <p style={{textAlign:"center",marginTop:24,fontSize:14,color:"#64748B"}}>
          Have an account?{" "}<button onClick={onSwitch} style={{background:"none",border:"none",color:"#A5B4FC",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Sign in →</button>
        </p>
      </div>
    </div>
  );
}
