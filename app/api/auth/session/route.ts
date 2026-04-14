import { NextRequest, NextResponse } from "next/server";
import { getOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("dotr_session");

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await getOne(`
      SELECT id, username, full_name, email, role, position_title
      FROM users
      WHERE username = ? AND is_active = 1
    `, [session.value]);

    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete("dotr_session");
      return response;
    }

    return NextResponse.json({
      user: {
        id: String(user.id),
        email: user.email || "",
        name: user.full_name,
        role: user.role === "hrdd_admin" ? "hrdd_admin" : user.role,
        office: user.position_title,
        position: user.position_title,
        initials: user.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ user: null });
  }
}
