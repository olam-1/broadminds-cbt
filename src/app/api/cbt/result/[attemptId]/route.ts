import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseClient";

export async function GET(_req: Request, { params }: { params: { attemptId: string } }) {
  try {
    const supa = getSupabaseServer();

    const { data: attempt, error } = await supa
      .from("exam_attempts")
      .select("score, percent, grade, passed, bank_id")
      .eq("id", params.attemptId)
      .single();

    if (error || !attempt) return NextResponse.json({ error: "Result not found" }, { status: 404 });

    const { data: qs } = await supa
      .from("questions")
      .select("id, marks")
      .eq("bank_id", attempt.bank_id);

    const total = (qs || []).reduce((a: number, q: any) => a + (q.marks ?? 1), 0);

    return NextResponse.json({
      score: attempt.score ?? 0,
      total,
      percent: attempt.percent ?? 0,
      grade: attempt.grade ?? "-",
      passed: !!attempt.passed
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
