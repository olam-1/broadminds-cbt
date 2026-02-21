import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Exam code is required" }, { status: 400 });
    }

    const supa = getSupabaseServer();

    const { data: examCode, error: e1 } = await supa
      .from("exam_codes")
      .select("id, bank_id, expires_at, max_attempts")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (e1 || !examCode) return NextResponse.json({ error: "Invalid exam code" }, { status: 400 });
    if (examCode.expires_at && new Date(examCode.expires_at) < new Date()) {
      return NextResponse.json({ error: "This exam code has expired" }, { status: 400 });
    }

    const { data: bank, error: e2 } = await supa
      .from("question_banks")
      .select("id, duration_minutes, pass_mark_percent, total_questions, status")
      .eq("id", examCode.bank_id)
      .single();

    if (e2 || !bank) return NextResponse.json({ error: "Exam bank not found" }, { status: 400 });
    if (bank.status !== "Published") return NextResponse.json({ error: "Exam not published yet" }, { status: 400 });

    // Create attempt
    const { data: attempt, error: e3 } = await supa
      .from("exam_attempts")
      .insert({
        bank_id: bank.id,
        exam_code_id: examCode.id,
        status: "in_progress",
        duration_minutes: bank.duration_minutes,
        started_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (e3 || !attempt) return NextResponse.json({ error: "Could not start exam" }, { status: 500 });

    return NextResponse.json({ attemptId: attempt.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
