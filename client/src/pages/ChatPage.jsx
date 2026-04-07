import { useState, useRef, useEffect } from "react";
import { Card, Btn, Input } from "../components/UI";
import { api } from "../utils/api";

const SUGGESTIONS = [
  "How can I reduce my home loan EMI?",
  "Best SIP funds for 2025 in India?",
  "How to switch from service to product company?",
  "Tax saving options under 80C for salaried?",
  "Is ₹50L enough to retire at 45 in India?",
  "How to negotiate salary in IT companies?",
];

const formatMsg = (text) => {
  // Bold **text**
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#A5B4FC">$1</strong>')
             .replace(/\n/g, "<br/>");
};

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"👋 Hi! I'm your LifePath AI advisor. I can help with:\n\n• **Debt & Loan** strategies for India\n• **Career** guidance and salary negotiation\n• **Investment** advice (SIP, PPF, ELSS, NPS)\n• **Tax saving** tips\n• **Financial planning** for any life goal\n\nWhat would you like to discuss today?" }
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, {role:"user", content:msg}]);
    setLoading(true);
    try {
      const history = messages.slice(-8);
      const { response } = await api.chat({ message:msg, history });
      setMessages(m => [...m, {role:"assistant", content:response}]);
    } catch(e) {
      setMessages(m => [...m, {role:"assistant", content:"⚠️ Sorry, I couldn't respond right now. Please check your API key or try again."}]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,height:"calc(100vh - 120px)"}}>

      {/* Header */}
      <div className="animate-fadeUp" style={{background:"linear-gradient(135deg,rgba(108,99,255,0.18),rgba(56,189,248,0.1))",border:"1px solid rgba(108,99,255,0.25)",borderRadius:16,padding:"16px 24px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🤖</div>
        <div>
          <div style={{fontSize:17,fontWeight:800,fontFamily:"'Syne',sans-serif"}}>LifePath AI Assistant</div>
          <div style={{fontSize:12,color:"#22C55E",display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22C55E",display:"inline-block"}} className="animate-pulse"/>
            Powered by Gemini — Indian Finance & Career Expert
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,padding:"4px 0"}}>
        {messages.map((m,i)=>(
          <div key={i} className="animate-fadeUp" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10}}>
            {m.role==="assistant" && (
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>🤖</div>
            )}
            <div style={{
              maxWidth:"78%", padding:"13px 16px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"
                ?"linear-gradient(135deg,#6C63FF,#4F46E5)"
                :"rgba(13,13,31,0.9)",
              border:m.role==="user"?"none":"1px solid rgba(108,99,255,0.18)",
              fontSize:14, color:"#F1F5F9", lineHeight:1.7,
            }} dangerouslySetInnerHTML={{__html:formatMsg(m.content)}}/>
            {m.role==="user" && (
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#334155,#1E293B)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{display:"flex",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#6C63FF,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
            <div style={{padding:"13px 18px",background:"rgba(13,13,31,0.9)",border:"1px solid rgba(108,99,255,0.18)",borderRadius:"16px 16px 16px 4px",display:"flex",gap:6,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#6C63FF",animation:`pulse 1s ${i*0.2}s ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {SUGGESTIONS.map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.25)",color:"#A5B4FC",borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}
              onMouseEnter={e=>e.target.style.background="rgba(108,99,255,0.2)"}
              onMouseLeave={e=>e.target.style.background="rgba(108,99,255,0.1)"}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{display:"flex",gap:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask me anything about your finances, career, or investments in India…"
          style={{flex:1,background:"rgba(15,15,35,0.9)",border:"1px solid rgba(108,99,255,0.25)",borderRadius:12,padding:"13px 18px",color:"#F1F5F9",fontSize:14,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="#6C63FF"}
          onBlur={e=>e.target.style.borderColor="rgba(108,99,255,0.25)"}
        />
        <Btn onClick={()=>send()} disabled={!input.trim()||loading} icon="➤" style={{padding:"13px 20px",flexShrink:0}}>
          Send
        </Btn>
      </div>
    </div>
  );
}
