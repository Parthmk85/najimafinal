"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0a", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden"
    }}>
      {/* Abstract Background Elements */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "white", borderRadius: 4, padding: "4rem 3.5rem",
          width: "90%", maxWidth: 450,
          boxShadow: "0 30px 100px rgba(0,0,0,0.5)",
          zIndex: 1, position: "relative"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{
            fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.4em", color: "#888",
            textTransform: "uppercase", marginBottom: "1rem"
          }}>Secure Portal</div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 900, margin: 0, color: "#000", letterSpacing: "-0.02em" }}>Admin</h1>
          <div style={{ width: 40, height: 2, background: "#000", margin: "1.5rem auto 0" }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#555", textTransform: "uppercase" }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                padding: "1rem", border: "1px solid #eee", borderRadius: 0,
                fontSize: "1rem", outline: "none", background: "#fcfcfc",
                transition: "all 0.3s ease", color: "#000"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#555", textTransform: "uppercase" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                padding: "1rem", border: "1px solid #eee", borderRadius: 0,
                fontSize: "1rem", outline: "none", background: "#fcfcfc",
                transition: "all 0.3s ease", color: "#000"
              }}
            />
          </div>
          
          {error && <p style={{ color: "#ff4444", fontSize: "0.85rem", margin: 0, textAlign: "center", fontWeight: 600 }}>{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1.2rem", background: "#000", color: "#fff", border: "none",
              borderRadius: 0, fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: "1rem", transition: "all 0.3s ease",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.75rem", color: "#aaa" }}>
          &copy; {new Date().getFullYear()} Vision of Akash • All Rights Reserved
        </div>
      </motion.div>
    </div>
  );
}
