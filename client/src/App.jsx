import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import HomePage    from "./pages/HomePage";
import { FeaturesPage, HowItWorksPage, PricingPage, AboutPage } from "./pages/PublicPages";
import { SignInPage, SignUpPage } from "./pages/AuthPages";
import OnboardingPage from "./pages/OnBoardingPage";

// App pages (auth required)
import AppLayout      from "./components/AppLayout";
import DashboardPage  from "./pages/DashboardPage";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import LoanReliefPage from "./pages/LoanReliefPage";
import FinancePage    from "./pages/FinancePage";
import GoalsPage      from "./pages/GoalsPage";
import PDFReportPage  from "./pages/PDFReportPage";
import ChatPage       from "./pages/ChatPage";
// Correct
import { Spinner } from "./components/UI.jsx";

const APP_PAGES = ["dashboard","ai-analysis","loan-relief","finance","goals","pdf-report","chat"];

function AppRouter() {
  const { user, loading } = useAuth();
  const [page, setPage]   = useState("home");

  // Sync page from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#","");
    if (hash) setPage(hash);
    const onHash = () => setPage(window.location.hash.replace("#","") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (p) => {
    window.location.hash = p;
    setPage(p);
    window.scrollTo(0, 0);
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#080814",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Spinner/>
    </div>
  );

  // Public pages
  if (page === "home")     return <HomePage    onNavigate={navigate}/>;
  if (page === "features") return <FeaturesPage onNavigate={navigate}/>;
  if (page === "how")      return <HowItWorksPage onNavigate={navigate}/>;
  if (page === "pricing")  return <PricingPage  onNavigate={navigate}/>;
  if (page === "about")    return <AboutPage    onNavigate={navigate}/>;

  // Auth pages
  if (page === "signin") {
    if (user) { navigate("dashboard"); return null; }
    return <SignInPage onSwitch={()=>navigate("signup")} onSuccess={(u)=>navigate(u.onboardingComplete?"dashboard":"onboarding")}/>;
  }
  if (page === "signup") {
    if (user) { navigate("dashboard"); return null; }
    return <SignUpPage onSwitch={()=>navigate("signin")} onSuccess={(u)=>navigate(u.onboardingComplete?"dashboard":"onboarding")}/>;
  }

  // Onboarding — must be logged in
  if (page === "onboarding") {
    if (!user)              { navigate("signin"); return null; }
    if (user.onboardingComplete) { navigate("dashboard"); return null; }
    return <OnboardingPage onComplete={()=>navigate("dashboard")}/>;
  }

  // Protected app pages
  if (APP_PAGES.includes(page)) {
    if (!user)                   { navigate("signin"); return null; }
    if (!user.onboardingComplete){ navigate("onboarding"); return null; }

    const appPages = {
      dashboard:    <DashboardPage  onNavigate={navigate}/>,
      "ai-analysis":<AIAnalysisPage/>,
      "loan-relief":<LoanReliefPage/>,
      finance:      <FinancePage/>,
      goals:        <GoalsPage/>,
      "pdf-report": <PDFReportPage/>,
      chat:         <ChatPage/>,
    };

    return (
      <AppLayout active={page} onNavigate={navigate}>
        {appPages[page]}
      </AppLayout>
    );
  }

  // 404
  return (
    <div style={{minHeight:"100vh",background:"#080814",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,color:"#64748B",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{fontSize:64}}>🔍</div>
      <div style={{fontSize:24,fontWeight:800,color:"#94A3B8",fontFamily:"'Syne',sans-serif"}}>Page not found</div>
      <button onClick={()=>navigate("home")} style={{background:"rgba(108,99,255,0.2)",border:"1px solid rgba(108,99,255,0.4)",color:"#A5B4FC",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>← Go Home</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{style:{background:"#1E293B",color:"#F1F5F9",border:"1px solid rgba(108,99,255,0.3)"}}}/>
      <AppRouter/>
    </AuthProvider>
  );
}
