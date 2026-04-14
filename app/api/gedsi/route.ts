import { NextRequest, NextResponse } from "next/server";
import { getOne, executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, gedsi, social } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    if (gedsi) {
      await executeQuery(
        `
        INSERT INTO application_gedsi (application_id, g1, g2, g3, g4, g5, g6, g7, g8)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(application_id) DO UPDATE SET
          g1 = excluded.g1, g2 = excluded.g2, g3 = excluded.g3, g4 = excluded.g4,
          g5 = excluded.g5, g6 = excluded.g6, g7 = excluded.g7, g8 = excluded.g8
        `,
        [
          parseInt(applicationId),
          gedsi.g1 || null,
          gedsi.g2 || null,
          gedsi.g3 || null,
          gedsi.g4 || null,
          gedsi.g5 || null,
          gedsi.g6 || null,
          gedsi.g7 || null,
          gedsi.g8 || null,
        ]
      );
    }

    if (social) {
      await executeQuery(
        `
        INSERT INTO application_social_inclusion (application_id, s1, s2)
        VALUES (?, ?, ?)
        ON CONFLICT(application_id) DO UPDATE SET
          s1 = excluded.s1, s2 = excluded.s2
        `,
        [parseInt(applicationId), social.s1 || null, social.s2 || null]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save GEDSI/Social error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const gedsi = await getOne(
      "SELECT * FROM application_gedsi WHERE application_id = ?",
      [parseInt(applicationId)]
    );

    const social = await getOne(
      "SELECT * FROM application_social_inclusion WHERE application_id = ?",
      [parseInt(applicationId)]
    );

    return NextResponse.json({
      success: true,
      data: {
        gedsi: gedsi || null,
        social: social || null,
      },
    });
  } catch (error) {
    console.error("Get GEDSI/Social error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
