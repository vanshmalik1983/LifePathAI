import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lp_token");
    const saved = localStorage.getItem("lp_user");
    if (token && saved) { try { setUser(JSON.parse(saved)); } catch {} }
    setLoading(false);
  }, []);

  const signIn = (u, token) => {
    localStorage.setItem("lp_token", token);
    localStorage.setItem("lp_user", JSON.stringify(u));
    setUser(u);
  };
  const signOut = () => {
    localStorage.removeItem("lp_token");
    localStorage.removeItem("lp_user");
    setUser(null);
  };
  const updateUser = (u) => {
    const merged = { ...user, ...u };
    localStorage.setItem("lp_user", JSON.stringify(merged));
    setUser(merged);
  };

  return <Ctx.Provider value={{ user, loading, signIn, signOut, updateUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
