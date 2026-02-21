"use client";

import { useEffect, useState } from "react";

export default function ResultPage({ params }: { params: { attemptId: string } }) {
  const attemptId = params.attemptId;
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/cbt/result/${attemptId}`);
        const d = await res.json();
        if (!res.ok) throw new Error(d?.error || "Failed");
        setData(d);
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [attemptId]);

  if (err) return <div className="card" style={{ color:"#c00" }}>{err}</div>;
  if (!data) return <div className="card">Loading result…</div>;

  return (
    <div className="card">
      <h1>CBT Result</h1>
      <div className="kv"><span className="muted">Score</span><b>{data.score} / {data.total}</b></div>
      <div className="kv"><span className="muted">Percentage</span><b>{data.percent}%</b></div>
      <div className="kv"><span className="muted">Grade</span><b>{data.grade}</b></div>
      <div className="kv"><span className="muted">Status</span><b style={{ color: data.passed ? "#0b5" : "#c00" }}>{data.passed ? "PASS" : "FAIL"}</b></div>
      <div style={{ display:"flex", gap:10, marginTop: 14, flexWrap:"wrap" }}>
        <a className="btn" href="/cbt">Back to CBT</a>
        <a className="btn secondary" href="/">Home</a>
      </div>
      <p className="small muted" style={{ marginTop: 12 }}>
        (Next phase: printable PDF result + parent notification.)
      </p>
    </div>
  );
}
