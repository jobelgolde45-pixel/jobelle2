import { NextResponse } from "next/server";
import { getAll } from "@/lib/db";

export async function GET() {
  try {
    const offices = await getAll(
      "SELECT id, name, office_head, created_at, updated_at FROM offices ORDER BY name ASC"
    );

    return NextResponse.json({
      success: true,
      data: offices.map((o: any) => ({
        id: String(o.id),
        name: o.name,
        officeHead: o.office_head,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      })),
    });
  } catch (error) {
    console.error("Get offices error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
