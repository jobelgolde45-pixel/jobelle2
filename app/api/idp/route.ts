import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getAll, getOne } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    if (id) {
      const idp = await getOne(`SELECT * FROM idp WHERE id = ?`, [id]);
      if (!idp) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: idp });
    }

    const sql = userId
      ? `SELECT * FROM idp WHERE user_id = ? ORDER BY created_at DESC`
      : `SELECT i.*, u.full_name FROM idp i LEFT JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC`;

    const data = await getAll(sql, userId ? [userId] : []);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, currentCompetencies, targetCompetencies, developmentActivities, targetDate, remarks } = body;

    const now = new Date().toISOString();
    const result = await executeQuery(
      `INSERT INTO idp (user_id, current_competencies, target_competencies, development_activities, target_date, remarks, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
      [userId, currentCompetencies, targetCompetencies, developmentActivities, targetDate || null, remarks || null, now, now]
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, remarks, supervisorRemarks, hrddRemarks } = body;

    const now = new Date().toISOString();
    await executeQuery(
      `UPDATE idp SET status = COALESCE(?, status), remarks = COALESCE(?, remarks), supervisor_remarks = COALESCE(?, supervisor_remarks), hrdd_remarks = COALESCE(?, hrdd_remarks), updated_at = ? WHERE id = ?`,
      [status || null, remarks || null, supervisorRemarks || null, hrddRemarks || null, now, id]
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
