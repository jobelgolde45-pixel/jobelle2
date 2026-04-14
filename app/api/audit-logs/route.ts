import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getAll } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("entityType");
    const limit = parseInt(searchParams.get("limit") || "100");

    const sql = entityType
      ? `SELECT al.*, u.full_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.entity_type = ? ORDER BY al.created_at DESC LIMIT ?`
      : `SELECT al.*, u.full_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT ?`;

    const data = await getAll(sql, entityType ? [entityType, limit] : [limit]);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, entityType, entityId, oldValue, newValue, ipAddress } = body;

    await executeQuery(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, action, entityType, entityId || null, oldValue ? JSON.stringify(oldValue) : null, newValue ? JSON.stringify(newValue) : null, ipAddress || null, new Date().toISOString()]
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
