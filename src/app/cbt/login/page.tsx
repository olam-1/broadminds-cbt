"use client";

import { useState } from "react";

export default function CBTLogin() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function start() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/cbt/start-by-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      window.location.href = `/cbt/exam/${data.attemptId}`;
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h1>Start CBT (Exam Code)</h1>
      <p className="muted">Enter your exam code to begin.</p>
      <input className="input" value={code} onChange={(e)=>setCode(e.target.value.toUpperCase())} placeholder="EXAM CODE" />
      <div style={{ display:"flex", gap:10, marginTop: 12 }}>
        <button className="btn" disabled={busy || code.trim().length < 4} onClick={start}>
          {busy ? "Starting..." : "Start Exam"}
        </button>
        <a className="btn secondary" href="/cbt">Back</a>
      </div>
      {err && <p style={{ color:"#c00", marginTop: 10 }}>{err}</p>}
      <p className="small muted" style={{ marginTop: 12 }}>
        Do not refresh during the exam. Ensure stable internet.
      </p>
    </div>
  );
}
