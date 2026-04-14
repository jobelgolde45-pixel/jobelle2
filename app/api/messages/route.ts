import { NextRequest, NextResponse } from "next/server";
import { getAll, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const messages = await getAll(
      `
      SELECT id, application_id, sender_name, sender_user_id, message_text, is_read, created_at
      FROM application_messages
      WHERE application_id = ?
      ORDER BY created_at ASC
      `,
      [parseInt(applicationId)]
    );

    return NextResponse.json({
      success: true,
      data: messages.map((m: any) => ({
        id: String(m.id),
        applicationId: String(m.application_id),
        senderName: m.sender_name,
        senderUserId: m.sender_user_id,
        messageText: m.message_text,
        isRead: m.is_read === 1,
        createdAt: m.created_at,
      })),
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, senderName, messageText } = body;

    if (!applicationId || !senderName || !messageText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `
      INSERT INTO application_messages (application_id, sender_name, message_text, is_read, created_at)
      VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
      `,
      [parseInt(applicationId), senderName, messageText]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
