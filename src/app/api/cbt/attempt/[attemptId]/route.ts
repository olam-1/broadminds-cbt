import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseClient";

export async function GET(_req: Request, { params }: { params: { attemptId: string } }) {
  try {
    const supa = getSupabaseServer();
    const attemptId = params.attemptId;

    const { data: attempt, error: e1 } = await supa
      .from("exam_attempts")
      .select("id, bank_id, started_at, duration_minutes, status")
      .eq("id", attemptId)
      .single();

    if (e1 || !attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    if (attempt.status !== "in_progress") {
      return NextResponse.json({ error: "This attempt is not active" }, { status: 400 });
    }

    const started = new Date(attempt.started_at);
    const end = new Date(started.getTime() + attempt.duration_minutes * 60_000);
    const secondsLeft = Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));

    // Pull questions for bank (limit by total_questions if present)
    const { data: bank, error: eb } = await supa
      .from("question_banks")
      .select("total_questions, shuffle_questions")
      .eq("id", attempt.bank_id)
      .single();
    if (eb || !bank) return NextResponse.json({ error: "Bank not found" }, { status: 400 });

    let qQuery = supa
      .from("questions")
      .select("id, question_text, option_a, option_b, option_c, option_d")
      .eq("bank_id", attempt.bank_id);

    // simple ordering: random if shuffle_questions; else by created_at/id
    if (bank.shuffle_questions) qQuery = qQuery.order("id", { ascending: false }); // lightweight shuffle placeholder
    else qQuery = qQuery.order("id", { ascending: true });

    if (bank.total_questions) qQuery = qQuery.limit(bank.total_questions);

    const { data: questions, error: e2 } = await qQuery;
    if (e2 || !questions) return NextResponse.json({ error: "Questions not found" }, { status: 400 });

    const { data: ans, error: e3 } = await supa
      .from("attempt_answers")
      .select("question_id, selected_option")
      .eq("attempt_id", attemptId);

    const answers: Record<string, string> = {};
    (ans || []).forEach((a: any) => { answers[a.question_id] = a.selected_option; });

    return NextResponse.json({ secondsLeft, questions, answers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
