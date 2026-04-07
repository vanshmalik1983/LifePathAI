const BASE = "/api";
const tok = () => localStorage.getItem("lp_token");

async function req(path, opts = {}) {
  const t = tok();
  const r = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type":"application/json", ...(t?{Authorization:`Bearer ${t}`}:{}), ...opts.headers },
    ...opts,
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}

export const api = {
  signup:         b => req("/auth/signup",   { method:"POST", body:JSON.stringify(b) }),
  signin:         b => req("/auth/signin",   { method:"POST", body:JSON.stringify(b) }),
  saveProfile:    b => req("/auth/profile",  { method:"POST", body:JSON.stringify(b) }),
  getMe:          () => req("/auth/me"),
  analyzeLoan:    b => req("/loan/analyze",  { method:"POST", body:JSON.stringify(b) }),
  analyzeCareer:  b => req("/career/analyze",{ method:"POST", body:JSON.stringify(b) }),
  financePlan:    b => req("/finance/plan",  { method:"POST", body:JSON.stringify(b) }),
  goalsPlan:      b => req("/goals/plan",    { method:"POST", body:JSON.stringify(b) }),
  generateReport: b => req("/report/generate",{method:"POST", body:JSON.stringify(b) }),
  chat:           b => req("/chat/message",  { method:"POST", body:JSON.stringify(b) }),
};
