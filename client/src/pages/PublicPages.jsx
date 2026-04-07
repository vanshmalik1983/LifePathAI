import { useState } from "react";
import Navbar from "../components/Navbar";

const GradBtn = ({children,onClick,style={}}) => (
  <button onClick={onClick} style={{background:"linear-gradient(135deg,#6C63FF,#38BDF8)",border:"none",color:"white",fontWeight:700,fontSize:15,padding:"13px 28px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 24px rgba(108,99,255,0.35)",...style}}>
    {children}
  </button>
);

const Section = ({children,style={}}) => (
  <section style={{padding:"80px 0",...style}}>{children}</section>
);
const Container = ({children,style={}}) => (
  <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",...style}}>{children}</div>
);
const STag = ({children}) => (
  <div style={{display:"inline-block",background:"rgba(108,99,255,0.15)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:30,padding:"6px 18px",fontSize:13,color:"#A5B4FC",fontWeight:600,marginBottom:16}}>
    {children}
  </div>
);
const H2 = ({children,style={}}) => (
  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,color:"#F1F5F9",lineHeight:1.15,letterSpacing:-1,...style}}>{children}</h2>
);

// ── FEATURES PAGE ─────────────────────────────────────────
export function FeaturesPage({ onNavigate }) {
  const features = [
    { icon:"🧠", title:"AI Career Analysis",       color:"#6C63FF", desc:"Gemini AI analyses your skills, experience, and goals to rank the best career paths for you in India's job market. Get a personalised roadmap with exact steps, resources, and salary projections.", bullets:["Top career match scoring","Skill gap analysis with free learning resources","Salary growth projection (5 years)","Interview tips for Indian companies","Trending skills for 2025"] },
    { icon:"💰", title:"Loan Relief Advisor",       color:"#22C55E", desc:"Enter your salary, EMI, and debt details. AI instantly calculates your debt health score and generates 3 customised payoff strategies — Avalanche, Snowball, and Consolidation.", bullets:["Debt health score (0–100)","3 AI payoff strategies compared","Indian product recommendations (Balance transfer, refinancing)","Monthly budget optimisation","Payoff timeline projection chart"] },
    { icon:"📈", title:"Financial Planning",         color:"#38BDF8", desc:"Get a personalised investment plan tailored to your income, goals, and risk appetite. AI recommends specific Indian mutual funds, SIP amounts, and tax-saving instruments.", bullets:["Investment allocation plan (SIP, PPF, ELSS, NPS)","Tax saving under 80C, 80D, 80CCD","Net worth projection (10 years)","Emergency fund calculator","50/30/20 budget personalised for India"] },
    { icon:"🎯", title:"Life Goals Planner",        color:"#FBBF24", desc:"Set your life goals — home, car, retirement, child's education — and AI calculates the exact monthly SIP or savings amount you need, along with the best Indian financial instrument.", bullets:["Goal feasibility scoring","Monthly savings amount per goal","Indian instrument recommendation per goal","Milestone-based tracking","Priority ordering of goals"] },
    { icon:"📄", title:"AI PDF Report Generator",  color:"#F97316", desc:"Generate a beautifully formatted life plan report combining all your career, financial, and debt data. Download as PDF and share with your family or financial advisor.", bullets:["Executive summary with overall life score","Scores for career, finance, debt, goals","Critical actions prioritised by AI","5-year life outlook","Download & print ready"] },
    { icon:"💬", title:"AI Chat Assistant",        color:"#EC4899", desc:"Ask anything about your finances, career, or investments. The AI chat knows the Indian market — SIP returns, ELSS funds, salary negotiation in IT, EMI calculators, and much more.", bullets:["Powered by Gemini 1.5 Flash","Indian market context always applied","Conversation history maintained","Quick suggestion prompts","Available 24/7"] },
  ];

  return (
    <div style={{background:"#080814",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9"}}>
      <Navbar activePage="features" onNavigate={onNavigate}/>
      <div style={{paddingTop:62}}>
        {/* Hero */}
        <Section style={{background:"linear-gradient(180deg,rgba(108,99,255,0.08) 0%,transparent 100%)",padding:"80px 0 60px"}}>
          <Container style={{textAlign:"center"}}>
            <STag>✨ All Features</STag>
            <H2>Everything you need to plan<br/>your <span className="grad-text">dream life</span></H2>
            <p style={{fontSize:17,color:"#94A3B8",marginTop:16,marginBottom:36,maxWidth:600,margin:"16px auto 36px"}}>6 powerful AI tools, all designed specifically for India — Indian salaries, Indian financial products, Indian job market.</p>
            <GradBtn onClick={()=>onNavigate("signup")}>Start Free → No credit card</GradBtn>
          </Container>
        </Section>

        {/* Features grid */}
        <Section style={{paddingTop:20}}>
          <Container>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24}}>
              {features.map((f,i)=>(
                <div key={i} className={`au${i+1} glass`} style={{padding:28,borderTop:`3px solid ${f.color}`}}>
                  <div style={{fontSize:40,marginBottom:16}}>{f.icon}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:12}}>{f.title}</div>
                  <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.7,marginBottom:20}}>{f.desc}</p>
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16}}>
                    {f.bullets.map((b,j)=>(
                      <div key={j} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,fontSize:13,color:"#CBD5E1"}}>
                        <span style={{color:f.color,fontWeight:700}}>✓</span>{b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}

// ── HOW IT WORKS PAGE ─────────────────────────────────────
export function HowItWorksPage({ onNavigate }) {
  const steps = [
    { n:"01", icon:"✍️", title:"Create Your Account",      desc:"Sign up in 30 seconds with just your name, email, and password. No credit card required to get started.", color:"#6C63FF" },
    { n:"02", icon:"👤", title:"Complete Your Profile",     desc:"Fill in your personal details, current job, salary, savings, debts, and life goals through our 4-step onboarding wizard.", color:"#38BDF8" },
    { n:"03", icon:"🤖", title:"AI Analyses Everything",   desc:"Gemini AI processes your data and generates personalised insights — career paths, debt strategies, investment plans, and goal roadmaps.", color:"#22C55E" },
    { n:"04", icon:"📊", title:"See Your Dashboard",       desc:"Your real net worth, savings rate, debt score, and life goals all appear on your dashboard — calculated from your actual numbers.", color:"#FBBF24" },
    { n:"05", icon:"💡", title:"Use AI Tools Anytime",     desc:"Dive into any feature: get loan relief strategies, career analysis, finance plans, or just chat with your AI advisor 24/7.", color:"#F97316" },
    { n:"06", icon:"📈", title:"Track Your Progress",      desc:"Update your profile as your situation changes. Generate PDF reports, share with your CA or family, and track your life score over time.", color:"#EC4899" },
  ];

  const faqs = [
    { q:"Is my financial data safe?", a:"Yes. Your data is stored in a password-protected MongoDB database. Passwords are hashed with bcrypt. We never share your data with any third party." },
    { q:"Which Gemini model does this use?", a:"LifePath AI uses Gemini 1.5 Flash — Google's fastest free-tier model. It handles all AI analysis, chat, and report generation." },
    { q:"Can I update my profile after onboarding?", a:"Yes. You can update your salary, savings, goals, and other details anytime from the dashboard. All AI insights recalculate with fresh data." },
    { q:"Does it work for freelancers and self-employed?", a:"Absolutely. You can set monthly income with variable amounts, add other income sources, and the AI adapts its advice for non-salaried profiles." },
    { q:"Is there a mobile app?", a:"The web app is fully responsive and works great on mobile browsers. A native app is on our roadmap." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{background:"#080814",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9"}}>
      <Navbar activePage="how" onNavigate={onNavigate}/>
      <div style={{paddingTop:62}}>
        <Section style={{background:"linear-gradient(180deg,rgba(56,189,248,0.08) 0%,transparent 100%)",padding:"80px 0 60px"}}>
          <Container style={{textAlign:"center"}}>
            <STag>🗺 How It Works</STag>
            <H2>From sign-up to insights<br/>in under <span className="grad-text">5 minutes</span></H2>
            <p style={{fontSize:17,color:"#94A3B8",margin:"16px auto 0",maxWidth:560}}>No complex setup. Just enter your details and let AI do the heavy lifting.</p>
          </Container>
        </Section>

        {/* Steps */}
        <Section style={{paddingTop:20}}>
          <Container>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
              {steps.map((s,i)=>(
                <div key={i} className={`au${i%5+1} glass`} style={{padding:28,display:"flex",gap:20}}>
                  <div style={{width:52,height:52,borderRadius:14,background:`${s.color}22`,border:`1px solid ${s.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.icon}</div>
                  <div>
                    <div style={{fontSize:11,color:s.color,fontWeight:700,letterSpacing:1,marginBottom:6}}>{s.n}</div>
                    <div style={{fontSize:17,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:8}}>{s.title}</div>
                    <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.7}}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* FAQ */}
        <Section>
          <Container>
            <div style={{textAlign:"center",marginBottom:48}}>
              <STag>❓ FAQ</STag>
              <H2>Frequently asked questions</H2>
            </div>
            <div style={{maxWidth:720,margin:"0 auto",display:"flex",flexDirection:"column",gap:12}}>
              {faqs.map((f,i)=>(
                <div key={i} className="glass" style={{overflow:"hidden"}}>
                  <div onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                    <span style={{fontSize:15,fontWeight:600,color:"#F1F5F9"}}>{f.q}</span>
                    <span
  style={{
    color: "#6C63FF",
    fontSize: 18,
    flexShrink: 0,
    transition: "transform 0.3s",
    transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
  }}
>
  +
</span>
                  </div>
                  {openFaq===i&&<div style={{padding:"0 22px 18px",fontSize:14,color:"#94A3B8",lineHeight:1.7,borderTop:"1px solid rgba(108,99,255,0.1)",paddingTop:14}}>{f.a}</div>}
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section style={{textAlign:"center",paddingTop:0}}>
          <Container>
            <div className="glass" style={{padding:"48px 32px",background:"linear-gradient(135deg,rgba(108,99,255,0.15),rgba(56,189,248,0.08))"}}>
              <H2>Ready to start?</H2>
              <p style={{fontSize:16,color:"#94A3B8",margin:"16px auto 32px",maxWidth:480}}>Join 50,000+ Indians planning their dream life with AI.</p>
              <GradBtn onClick={()=>onNavigate("signup")}>Get Started Free →</GradBtn>
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}

// ── PRICING PAGE ──────────────────────────────────────────
export function PricingPage({ onNavigate }) {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name:"Free", price:0, color:"#64748B", badge:null,
      desc:"Get started with AI-powered life planning",
      features:["Dashboard with real data","Basic loan analysis","Career match overview","AI chat (10 msgs/day)","1 PDF report/month"],
      notIncluded:["Advanced AI strategies","Finance planning","Goals roadmap","Unlimited chat","Priority support"],
      cta:"Start Free",
    },
    {
      name:"Pro", price:annual?599:699, color:"#6C63FF", badge:"Most Popular",
      desc:"Everything you need to achieve your goals",
      features:["Everything in Free","Unlimited AI analysis","Full loan relief strategies","Finance & investment planning","Goals roadmap with milestones","Unlimited AI chat","Unlimited PDF reports","Indian market insights","Priority support"],
      notIncluded:[],
      cta:"Start Pro →",
    },
    {
      name:"Family", price:annual?999:1199, color:"#22C55E", badge:"Best Value",
      desc:"One plan for the whole family",
      features:["Everything in Pro","Up to 4 family members","Shared goals dashboard","Family wealth overview","Joint financial planning","Dedicated advisor chat","Annual family report"],
      notIncluded:[],
      cta:"Start Family →",
    },
  ];

  return (
    <div style={{background:"#080814",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9"}}>
      <Navbar activePage="pricing" onNavigate={onNavigate}/>
      <div style={{paddingTop:62}}>
        <Section style={{background:"linear-gradient(180deg,rgba(34,197,94,0.08) 0%,transparent 100%)",padding:"80px 0 60px"}}>
          <Container style={{textAlign:"center"}}>
            <STag>💎 Pricing</STag>
            <H2>Simple, transparent pricing<br/>in <span className="grad-text">Indian Rupees</span></H2>
            <p style={{fontSize:17,color:"#94A3B8",margin:"16px auto 36px",maxWidth:500}}>No hidden charges. Cancel anytime. All plans include full access to your data.</p>
            {/* Toggle */}
            <div style={{display:"inline-flex",gap:0,background:"rgba(13,13,31,0.9)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:12,padding:4}}>
              {["Monthly","Annual (save 14%)"].map((t,i)=>(
                <button key={t} onClick={()=>setAnnual(i===1)} style={{background:annual===(i===1)?"rgba(108,99,255,0.25)":"transparent",border:annual===(i===1)?"1px solid rgba(108,99,255,0.4)":"1px solid transparent",color:annual===(i===1)?"#A5B4FC":"#64748B",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{t}</button>
              ))}
            </div>
          </Container>
        </Section>

        <Section style={{paddingTop:0}}>
          <Container>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,alignItems:"start"}}>
              {plans.map((pl,i)=>(
                <div key={i} className={`au${i+1} glass`} style={{padding:28,border:`1px solid ${pl.color}${pl.badge?"55":"22"}`,position:"relative",transform:pl.badge==="Most Popular"?"scale(1.02)":"none"}}>
                  {pl.badge&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${pl.color},${pl.color}99)`,color:"white",padding:"4px 18px",borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{pl.badge}</div>}
                  <div style={{fontSize:20,fontWeight:800,fontFamily:"'Syne',sans-serif",marginBottom:6,color:pl.color}}>{pl.name}</div>
                  <div style={{fontSize:36,fontWeight:800,color:"#F1F5F9",marginBottom:4}}>
                    {pl.price===0?"Free":`₹${pl.price}`}
                    {pl.price>0&&<span style={{fontSize:14,color:"#64748B",fontWeight:400}}>/mo</span>}
                  </div>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:24,minHeight:40}}>{pl.desc}</p>
                  <button onClick={()=>onNavigate("signup")} style={{width:"100%",background:pl.badge==="Most Popular"?`linear-gradient(135deg,${pl.color},${pl.color}99)`:`${pl.color}22`,border:`1px solid ${pl.color}55`,color:pl.badge==="Most Popular"?"white":pl.color,borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:24}}>
                    {pl.cta}
                  </button>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {pl.features.map((f,j)=><div key={j} style={{display:"flex",gap:10,fontSize:13,color:"#CBD5E1"}}><span style={{color:"#22C55E",fontWeight:700,flexShrink:0}}>✓</span>{f}</div>)}
                    {pl.notIncluded.map((f,j)=><div key={j} style={{display:"flex",gap:10,fontSize:13,color:"#475569"}}><span style={{flexShrink:0}}>✗</span>{f}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:48,padding:24,background:"rgba(13,13,31,0.6)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>🔒 Secure Payments via Razorpay · 🇮🇳 Made for India · 📧 support@lifepathai.in</div>
              <div style={{fontSize:13,color:"#64748B"}}>All prices in INR. GST applicable. Cancel anytime. 7-day money-back guarantee.</div>
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────
export function AboutPage({ onNavigate }) {
  const team = [
    { name:"Priya Sharma",    role:"Founder & CEO",     city:"Bangalore", emoji:"👩‍💼", bg:"#6C63FF" },
    { name:"Rahul Gupta",     role:"Head of AI",         city:"Hyderabad", emoji:"🧑‍💻", bg:"#38BDF8" },
    { name:"Ananya Joshi",    role:"Financial Advisor",  city:"Mumbai",    emoji:"👩‍🎓", bg:"#22C55E" },
    { name:"Kiran Reddy",     role:"Product Designer",   city:"Pune",      emoji:"🧑‍🎨", bg:"#FBBF24" },
  ];
  const stats = [
    {n:"50,000+",l:"Active Users"},
    {n:"₹12 Cr+",l:"Savings Generated"},
    {n:"4.9/5",l:"User Rating"},
    {n:"3",l:"Indian Cities"},
  ];
  const values = [
    {icon:"🇮🇳",title:"India-First",     desc:"Every feature is built for Indian salaries, Indian taxes, Indian financial products, and the Indian job market."},
    {icon:"🔒",title:"Privacy First",   desc:"Your financial data never leaves our secure servers. We use bcrypt + JWT security, and never sell data to anyone."},
    {icon:"🤖",title:"AI-Powered",      desc:"We use Google's Gemini AI to deliver personalised, actionable advice — not generic tips copied from a blog post."},
    {icon:"💚",title:"Genuinely Free",  desc:"Our free plan gives real value. We believe financial literacy should be accessible to every Indian, not just the wealthy."},
  ];

  return (
    <div style={{background:"#080814",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#F1F5F9"}}>
      <Navbar activePage="about" onNavigate={onNavigate}/>
      <div style={{paddingTop:62}}>
        {/* Hero */}
        <Section style={{background:"linear-gradient(180deg,rgba(236,72,153,0.08) 0%,transparent 100%)",padding:"80px 0 60px"}}>
          <Container style={{textAlign:"center"}}>
            <STag>🏢 About Us</STag>
            <H2>We believe every Indian deserves<br/>a <span className="grad-text">financial advisor</span></H2>
            <p style={{fontSize:17,color:"#94A3B8",margin:"16px auto 0",maxWidth:600}}>LifePath AI was built by a team of Indian engineers and financial experts who were tired of expensive advisors, confusing spreadsheets, and one-size-fits-all advice.</p>
          </Container>
        </Section>

        {/* Stats */}
        <Section style={{padding:"40px 0"}}>
          <Container>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20}}>
              {stats.map((s,i)=>(
                <div key={i} className={`au${i+1} glass`} style={{padding:"28px 24px",textAlign:"center"}}>
                  <div style={{fontSize:34,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#6C63FF,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.n}</div>
                  <div style={{fontSize:14,color:"#94A3B8",marginTop:6}}>{s.l}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Mission */}
        <Section>
          <Container>
            <div className="glass" style={{padding:"48px",background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(56,189,248,0.06))"}}>
              <STag>🎯 Our Mission</STag>
              <H2 style={{marginBottom:20}}>Democratising financial<br/>intelligence for India</H2>
              <p style={{fontSize:16,color:"#CBD5E1",lineHeight:1.8,maxWidth:700}}>
                In India, a good CA or financial advisor charges ₹5,000–₹50,000 per consultation. Most middle-class families can't afford personalised advice. LifePath AI changes that — giving every Indian the same quality of insight that was previously only available to the wealthy, at a fraction of the cost.
              </p>
            </div>
          </Container>
        </Section>

        {/* Values */}
        <Section style={{paddingTop:0}}>
          <Container>
            <div style={{textAlign:"center",marginBottom:48}}>
              <STag>💡 Our Values</STag>
              <H2>What we stand for</H2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
              {values.map((v,i)=>(
                <div key={i} className={`au${i+1} glass`} style={{padding:28}}>
                  <div style={{fontSize:36,marginBottom:14}}>{v.icon}</div>
                  <div style={{fontSize:18,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:10}}>{v.title}</div>
                  <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.7}}>{v.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section style={{paddingTop:0}}>
          <Container>
            <div style={{textAlign:"center",marginBottom:48}}>
              <STag>👥 The Team</STag>
              <H2>Built by Indians, for Indians</H2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,justifyItems:"center"}}>
              {team.map((m,i)=>(
                <div key={i} className={`au${i+1} glass`} style={{padding:28,textAlign:"center",width:"100%"}}>
                  <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${m.bg},${m.bg}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px"}}>{m.emoji}</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#F1F5F9"}}>{m.name}</div>
                  <div style={{fontSize:13,color:m.bg,marginTop:4,fontWeight:600}}>{m.role}</div>
                  <div style={{fontSize:12,color:"#64748B",marginTop:4}}>📍 {m.city}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section style={{paddingTop:0}}>
          <Container>
            <div className="glass" style={{padding:"48px 32px",textAlign:"center",background:"linear-gradient(135deg,rgba(108,99,255,0.15),rgba(56,189,248,0.08))"}}>
              <H2>Join 50,000+ Indians on LifePath AI</H2>
              <p style={{fontSize:16,color:"#94A3B8",margin:"16px auto 32px",maxWidth:480}}>Free to start. No credit card. No spam. Just your personalised path to financial freedom.</p>
              <GradBtn onClick={()=>onNavigate("signup")}>Start Your Free Journey →</GradBtn>
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}
