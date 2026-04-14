import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getAll, getOne } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'flashcard' | 'quiz'
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");

    if (type === "progress" && userId) {
      const data = await getAll(
        `SELECT * FROM assessment_progress WHERE user_id = ? ORDER BY updated_at DESC`,
        [userId]
      );
      return NextResponse.json({ success: true, data });
    }

    if (type === "flashcard") {
      const sql = category
        ? `SELECT * FROM flashcards WHERE category = ? AND is_active = 1 ORDER BY sort_order`
        : `SELECT * FROM flashcards WHERE is_active = 1 ORDER BY category, sort_order`;
      const data = await getAll(sql, category ? [category] : []);
      return NextResponse.json({ success: true, data });
    }

    if (type === "quiz") {
      const sql = category
        ? `SELECT * FROM quiz_questions WHERE category = ? AND is_active = 1 ORDER BY sort_order`
        : `SELECT * FROM quiz_questions WHERE is_active = 1 ORDER BY category, sort_order`;
      const data = await getAll(sql, category ? [category] : []);
      return NextResponse.json({ success: true, data });
    }

    // Return categories summary
    const flashcardCats = await getAll(`SELECT category, COUNT(*) as count FROM flashcards WHERE is_active = 1 GROUP BY category`);
    const quizCats = await getAll(`SELECT category, COUNT(*) as count FROM quiz_questions WHERE is_active = 1 GROUP BY category`);
    return NextResponse.json({ success: true, data: { flashcardCategories: flashcardCats, quizCategories: quizCats } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, userId, category, score, totalQuestions, answers } = body;

    if (type === "quiz_result") {
      const now = new Date().toISOString();
      const result = await executeQuery(
        `INSERT INTO quiz_results (user_id, category, score, total_questions, answers_json, passed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, category, score, totalQuestions, JSON.stringify(answers || []), score >= totalQuestions * 0.75 ? 1 : 0, now]
      );

      // Auto-issue certificate if passed
      if (score >= totalQuestions * 0.75) {
        const certNumber = `DOTR-${Date.now().toString().slice(-8).padStart(8, "0")}`;
        await executeQuery(
          `INSERT OR IGNORE INTO certificates (cert_number, user_id, training_title, issued_by, issued_at, status)
           VALUES (?, ?, ?, 'DOTr-HRDD', ?, 'active')`,
          [certNumber, userId, `CSC Exam Prep: ${category}`, now]
        );
      }

      return NextResponse.json({ success: true, passed: score >= totalQuestions * 0.75, id: result.lastInsertRowid });
    }

    if (type === "progress") {
      const now = new Date().toISOString();
      await executeQuery(
        `INSERT INTO assessment_progress (user_id, category, assessment_type, completed_items, total_items, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, category, assessment_type) DO UPDATE SET
           completed_items = excluded.completed_items,
           total_items = excluded.total_items,
           updated_at = excluded.updated_at`,
        [userId, category, body.assessmentType || "flashcard", body.completedItems || 0, body.totalItems || 0, now]
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
