import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getOne, executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getOne(`
      SELECT u.*, a.password_hash
      FROM users u
      INNER JOIN auth_accounts a ON u.id = a.user_id
      WHERE u.username = ? AND u.is_active = 1
    `, [username.trim().toLowerCase()]);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await executeQuery(
      "UPDATE auth_accounts SET last_login = CURRENT_TIMESTAMP WHERE username = ?",
      [username]
    );

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      user: {
        id: String(userWithoutPassword.id),
        email: userWithoutPassword.email || "",
        name: userWithoutPassword.full_name,
        role: mapRole(userWithoutPassword.role),
        office: userWithoutPassword.office_name || userWithoutPassword.position_title,
        position: userWithoutPassword.position_title,
        initials: getInitials(userWithoutPassword.full_name),
      },
    });

    // Set HTTP-only session cookie (using username as session identifier for now)
    response.cookies.set("dotr_session", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const session = request.cookies.get("dotr_session");

    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Get user from database
    const user = await getOne(`
      SELECT id, username, full_name, email, role, office_id, position_title
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
        role: mapRole(user.role),
        office: user.office_id || user.position_title,
        position: user.position_title,
        initials: getInitials(user.full_name),
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ user: null });
  }
}

export async function POST_Logout() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("dotr_session");
  return response;
}

function mapRole(dbRole: string): string {
  switch (dbRole) {
    case "employee":
      return "employee";
    case "supervisor":
      return "supervisor";
    case "hrdd_admin":
      return "hrdd_admin";
    case "signatory":
      return "signatory";
    default:
      return "employee";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
