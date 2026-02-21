import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseClient";

function grade(percent: number) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

export async function POST(req: Request) {
  try {
    const { attemptId } = await req.json();
    if (!attemptId) return NextResponse.json({ error: "attemptId required" }, { status: 400 });

    const supa = getSupabaseServer();

    const { data: attempt, error: e1 } = await supa
      .from("exam_attempts")
      .select("id, bank_id, status")
      .eq("id", attemptId)
      .single();
    if (e1 || !attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    if (attempt.status !== "in_progress") return NextResponse.json({ error: "Attempt already submitted" }, { status: 400 });

    const { data: qs, error: e2 } = await supa
      .from("questions")
      .select("id, correct_option, marks")
      .eq("bank_id", attempt.bank_id);
    if (e2 || !qs) return NextResponse.json({ error: "Questions not found" }, { status: 400 });

    const { data: ans, error: e3 } = await supa
      .from("attempt_answers")
      .select("question_id, selected_option")
      .eq("attempt_id", attemptId);
    if (e3) return NextResponse.json({ error: "Answers not found" }, { status: 400 });

    const amap = new Map<string, string>();
    (ans || []).forEach((a: any) => amap.set(a.question_id, a.selected_option));

    let score = 0;
    let total = 0;
    for (const q of qs) {
      const m = q.marks ?? 1;
      total += m;
      const picked = amap.get(q.id);
      if (picked && picked === q.correct_option) score += m;
    }
    const percent = total === 0 ? 0 : Math.round((score / total) * 100);
    const g = grade(percent);

    // pass mark
    const { data: bank, error: eb } = await supa
      .from("question_banks")
      .select("pass_mark_percent")
      .eq("id", attempt.bank_id)
      .single();

    const passMark = bank?.pass_mark_percent ?? 50;
    const passed = percent >= passMark;

    const { error: e4 } = await supa
      .from("exam_attempts")
      .update({
        status: "submitted",
        ended_at: new Date().toISOString(),
        score,
        percent,
        grade: g,
        passed
      })
      .eq("id", attemptId);

    if (e4) return NextResponse.json({ error: "Could not submit" }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
