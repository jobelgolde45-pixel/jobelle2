import { NextRequest, NextResponse } from "next/server";
import { getAll, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let sql = `
      SELECT * FROM mis_assistance_requests
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status) {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY created_at DESC`;

    const requests = await getAll(sql, args);

    return NextResponse.json({
      success: true,
      data: requests.map((r: any) => ({
        id: String(r.id),
        requestType: r.request_type,
        requestDetails: r.request_details,
        priority: r.priority,
        status: r.status,
        requestedBy: r.requested_by,
        requestedDate: r.requested_date,
        resolutionDate: r.resolution_date,
        remarks: r.remarks,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error("Get MIS requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestType, requestDetails, priority, requestedBy } = body;

    if (!requestType || !requestDetails || !priority || !requestedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `
      INSERT INTO mis_assistance_requests (
        request_type, request_details, priority, status, requested_by, requested_date
      ) VALUES (?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
      `,
      [requestType, requestDetails, priority, requestedBy]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create MIS request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, remarks } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (status) {
      updates.push("status = ?");
      args.push(status);
    }

    if (remarks !== undefined) {
      updates.push("remarks = ?");
      args.push(remarks);
    }

    if (status === "completed") {
      updates.push("resolution_date = CURRENT_TIMESTAMP");
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    args.push(id);

    await executeQuery(
      `UPDATE mis_assistance_requests SET ${updates.join(", ")} WHERE id = ?`,
      args
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update MIS request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
