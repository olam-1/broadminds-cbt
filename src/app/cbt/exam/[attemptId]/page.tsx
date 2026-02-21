"use client";

import { useEffect, useMemo, useState } from "react";

type Q = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

export default function ExamPage({ params }: { params: { attemptId: string } }) {
  const attemptId = params.attemptId;
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const current = questions[idx];

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await fetch(`/api/cbt/attempt/${attemptId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load attempt");
        setQuestions(data.questions);
        setAnswers(data.answers || {});
        setSecondsLeft(data.secondsLeft);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId]);

  useEffect(() => {
    if (loading) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [loading, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && !loading && questions.length) {
      // Auto-submit
      submit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, loading, questions.length]);

  async function saveAnswer(qid: string, opt: string) {
    setAnswers((a) => ({ ...a, [qid]: opt }));
    setSaving(true);
    try {
      await fetch("/api/cbt/save-answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptId, questionId: qid, selectedOption: opt })
      });
    } finally {
      setSaving(false);
    }
  }

  async function submit(auto = false) {
    if (!auto) {
      const ok = confirm("Submit exam now? Unanswered questions will be marked wrong.");
      if (!ok) return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/cbt/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submit failed");
      window.location.href = `/cbt/result/${attemptId}`;
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return { answered, total: questions.length };
  }, [answers, questions.length]);

  if (loading) return <div className="card">Loading exam…</div>;
  if (err) return <div className="card" style={{ color: "#c00" }}>{err}</div>;
  if (!current) return <div className="card">No questions found.</div>;

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card" style={{ display:"flex", justifyContent:"space-between", gap: 10, alignItems:"center" }}>
        <div>
          <div className="small muted">Attempt</div>
          <div style={{ fontWeight: 800 }}>{attemptId}</div>
          <div className="small muted">Answered: {progress.answered}/{progress.total} {saving ? " • Saving…" : ""}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div className="small muted">Time Left</div>
          <div className="timer" style={{ fontSize: 28, color: secondsLeft <= 60 ? "#c00" : "#111" }}>
            {fmt(Math.max(0, secondsLeft))}
          </div>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="small muted">Question {idx + 1} of {questions.length}</div>
          <h3 style={{ marginTop: 8 }}>{current.question_text}</h3>

          <div className="grid" style={{ marginTop: 10 }}>
            {(["A","B","C","D"] as const).map((k) => {
              const txt = (k==="A"?current.option_a:k==="B"?current.option_b:k==="C"?current.option_c:current.option_d);
              const picked = answers[current.id] === k;
              return (
                <button
                  key={k}
                  className="btn secondary"
                  style={{ justifyContent: "flex-start", gap: 10, borderColor: picked ? "#111" : "#d7d9e6" }}
                  onClick={() => saveAnswer(current.id, k)}
                >
                  <b>{k}.</b> {txt}
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", gap: 10, marginTop: 14, flexWrap:"wrap" }}>
            <button className="btn secondary" disabled={idx===0} onClick={()=>setIdx((i)=>Math.max(0,i-1))}>Previous</button>
            <button className="btn secondary" disabled={idx===questions.length-1} onClick={()=>setIdx((i)=>Math.min(questions.length-1,i+1))}>Next</button>
            <button className="btn" onClick={()=>submit(false)}>Submit</button>
          </div>
        </div>

        <div className="card">
          <h3>Navigate</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(8, minmax(0,1fr))", gap: 8 }}>
            {questions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              return (
                <button
                  key={q.id}
                  className="btn secondary"
                  style={{
                    padding: "8px 0",
                    borderRadius: 10,
                    background: i===idx ? "#111" : "#fff",
                    color: i===idx ? "#fff" : "#111",
                    borderColor: isAnswered ? "#0b5" : "#d7d9e6"
                  }}
                  onClick={() => setIdx(i)}
                >
                  {i+1}
                </button>
              );
            })}
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>
            Green border = answered. Black filled = current question.
          </p>
        </div>
      </div>
    </div>
  );
}
