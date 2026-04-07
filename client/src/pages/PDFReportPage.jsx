import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card, Badge, Btn, SectionHeader, LoadingCard, EmptyState } from "../components/UI";
import { api } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

const fmt = n => {
  if (!n && n !== 0) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const SECTION_OPTS = [
  { id: "career", label: "Career Analysis", emoji: "🧠", included: true },
  { id: "finance", label: "Financial Projections", emoji: "📈", included: true },
  { id: "debt", label: "Debt Payoff Plan", emoji: "💰", included: true },
  { id: "goals", label: "Goals Roadmap", emoji: "🎯", included: true },
  { id: "invest", label: "Investment Strategy", emoji: "📊", included: false },
  { id: "tax", label: "Tax Planning", emoji: "📑", included: false },
];

const STATUS_COLOR = { "On Track": "#22C55E", "Needs Work": "#FBBF24", "Critical": "#EF4444" };

export default function PDFReportPage() {
  const [sections, setSections] = useState(SECTION_OPTS);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const toggleSection = id =>
    setSections(s => s.map(x => x.id === id ? { ...x, included: !x.included } : x));

  const handleGenerate = async () => {
    setGenerating(true); setResult(null); setError("");
    try {
      const data = await api.generateReport({
        profile: { name: "Alex Kumar", age: 30, location: "Bangalore", income: 75000 },
        loanData: { totalDebt: 2976600, monthlyEMI: 62300, debtToIncome: 83, healthScore: 62 },
        careerData: { currentRole: "Software Engineer", currentSalary: 800000, overallScore: 85, marketability: "High" },
        financeData: { monthlyIncome: 75000, savings: 200000, financialScore: 72 },
      });
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setGenerating(false); }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("LifePlanReport.pdf");
  };

  const sectionChartData = result
    ? Object.entries(result.sections).map(([key, sec]) => ({ name: key, score: sec.score }))
    : [];

  const netWorthData = result
    ? Array.from({ length: 5 }, (_, i) => ({
        year: new Date().getFullYear() + i,
        netWorth: result.netWorthProjection5yr * ((i + 1) / 5),
      }))
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "'Syne',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(108,99,255,0.1))", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>📄 AI Life Plan Report</div>
          <div style={{ fontSize: 14, color: "#94A3B8" }}>Customize your sections, charts, and download your life plan!</div>
        </div>
        {result && <Btn variant="secondary" icon="🖨" onClick={handleDownloadPDF}>Download PDF</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        {/* Section Selector */}
        <Card style={{ position: "sticky", top: 20, padding: 16 }}>
          <SectionHeader title="Select Sections" />
          {sections.map(s => (
            <div key={s.id} onClick={() => toggleSection(s.id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: 10, marginBottom: 8, cursor: "pointer", borderRadius: 10,
              background: s.included ? "linear-gradient(90deg,#6C63FF,#38BDF8)" : "#1E293B", color: s.included ? "white" : "#CBD5E1",
              transition: "all 0.3s",
            }}>
              <span>{s.emoji} {s.label}</span>
              <span>{s.included ? "✅" : "❌"}</span>
            </div>
          ))}
          <Btn onClick={handleGenerate} loading={generating} style={{ width: "100%", marginTop: 16 }}>
            {generating ? "Generating…" : result ? "Regenerate Report" : "Generate Report"}
          </Btn>
        </Card>

        {/* Report Preview */}
        <div id="report-content" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {generating && <LoadingCard lines={5} />}
          {result && (
            <>
              {/* Executive Summary */}
              <Card style={{ borderLeft: "5px solid #6C63FF", padding: 16, background: "#0F172A" }}>
                <SectionHeader title="📋 Executive Summary" />
                <p style={{ color: "#CBD5E1" }}>{result.executiveSummary}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {result.keyStrengths?.map((s,i)=><Badge key={i} color="#22C55E">{s}</Badge>)}
                </div>
              </Card>

              {/* Section Scores */}
              <Card style={{ padding: 16, background: "#111827" }}>
                <SectionHeader title="📊 Section Scores" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sectionChartData}>
                    <XAxis dataKey="name" stroke="#CBD5E1" />
                    <YAxis stroke="#CBD5E1" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6C63FF" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Net Worth / Career Growth */}
              <Card style={{ padding: 16, background: "#111827" }}>
                <SectionHeader title="📈 5-Year Net Worth Projection" />
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#CBD5E1" />
                    <YAxis stroke="#CBD5E1" />
                    <Tooltip />
                    <Line type="monotone" dataKey="netWorth" stroke="#0EA5E9" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Critical Actions */}
              {result.criticalActions?.length > 0 && (
                <Card style={{ padding: 16, background: "#0F172A" }}>
                  <SectionHeader title="⚡ Critical Actions" />
                  {result.criticalActions.map((a,i)=>(
                    <div key={i} style={{ padding: 10, marginBottom: 8, borderRadius: 10, background: "#6C63FF20", color: "#F1F5F9" }}>
                      <strong>{a.priority}. {a.action} ✅</strong>
                      <div style={{ fontSize: 12, color: "#CBD5E1" }}>{a.impact} [{a.timeline}]</div>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}
          {!result && !generating && <EmptyState icon="📄" title="Your report will appear here" sub="Select sections and click Generate Report"/>}
        </div>
      </div>
    </div>
  );
}