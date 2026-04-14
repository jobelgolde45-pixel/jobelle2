import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getAll, getOne } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const certId = searchParams.get("id");

    if (certId) {
      const cert = await getOne(
        `SELECT c.*, u.full_name, u.position_title, u.office_id
         FROM certificates c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [certId]
      );
      if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: cert });
    }

    const sql = userId
      ? `SELECT c.*, tp.title as training_title FROM certificates c LEFT JOIN training_programs tp ON c.training_program_id = tp.id WHERE c.user_id = ? ORDER BY c.issued_at DESC`
      : `SELECT c.*, u.full_name, tp.title as training_title FROM certificates c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN training_programs tp ON c.training_program_id = tp.id ORDER BY c.issued_at DESC`;

    const data = await getAll(sql, userId ? [userId] : []);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, trainingProgramId, trainingTitle, issuedBy, signatureDataUrl } = body;

    const certNumber = `DOTR-${Date.now().toString().slice(-8).padStart(8, "0")}`;
    const issuedAt = new Date().toISOString();

    const result = await executeQuery(
      `INSERT INTO certificates (cert_number, user_id, training_program_id, training_title, issued_by, signature_data_url, issued_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [certNumber, userId, trainingProgramId || null, trainingTitle, issuedBy || "DOTr-HRDD", signatureDataUrl || null, issuedAt]
    );

    return NextResponse.json({ success: true, certNumber, id: result.lastInsertRowid });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
