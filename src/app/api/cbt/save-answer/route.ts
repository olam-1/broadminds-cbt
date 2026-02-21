import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { attemptId, questionId, selectedOption } = await req.json();
    if (!attemptId || !questionId || !selectedOption) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supa = getSupabaseServer();

    // Upsert answer
    const { error } = await supa
      .from("attempt_answers")
      .upsert({
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: selectedOption,
        answered_at: new Date().toISOString()
      }, { onConflict: "attempt_id,question_id" });

    if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
