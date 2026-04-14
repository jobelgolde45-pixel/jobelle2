import { NextRequest, NextResponse } from "next/server";
import { getAll, getOne, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const officeId = searchParams.get("officeId");

    let sql = `
      SELECT id, username, full_name, email, role, office_id, position_title,
             employee_id_number, supervisor_name, employment_status, salary_grade,
             service_length, contact_number, gender, date_hired, is_active
      FROM users
      WHERE 1=1
    `;
    const args: any[] = [];

    if (role) {
      sql += ` AND role = ?`;
      args.push(role);
    }

    if (officeId) {
      sql += ` AND office_id = ?`;
      args.push(parseInt(officeId));
    }

    sql += ` ORDER BY full_name ASC`;

    const users = await getAll(sql, args);

    return NextResponse.json({
      success: true,
      data: users.map((u: any) => ({
        id: String(u.id),
        username: u.username,
        fullName: u.full_name,
        email: u.email,
        role: u.role,
        officeId: u.office_id,
        positionTitle: u.position_title,
        employeeIdNumber: u.employee_id_number,
        supervisorName: u.supervisor_name,
        employmentStatus: u.employment_status,
        salaryGrade: u.salary_grade,
        serviceLength: u.service_length,
        contactNumber: u.contact_number,
        gender: u.gender,
        dateHired: u.date_hired,
        isActive: u.is_active === 1,
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      username,
      fullName,
      email,
      role,
      officeId,
      positionTitle,
      employeeIdNumber,
      supervisorName,
      employmentStatus,
      salaryGrade,
      serviceLength,
      contactNumber,
      gender,
      dateHired,
      password,
    } = body;

    if (!username || !fullName || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existing = await getOne("SELECT id FROM users WHERE username = ?", [username]);
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const result = await executeQuery(
      `
      INSERT INTO users (
        username, full_name, email, role, office_id, position_title,
        employee_id_number, supervisor_name, employment_status, salary_grade,
        service_length, contact_number, gender, date_hired, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        username,
        fullName,
        email || null,
        role,
        officeId ? parseInt(officeId) : null,
        positionTitle || null,
        employeeIdNumber || null,
        supervisorName || null,
        employmentStatus || null,
        salaryGrade || null,
        serviceLength || null,
        contactNumber || null,
        gender || null,
        dateHired || null,
      ]
    );

    const userId = result.lastInsertRowid;

    // Create auth account if password provided
    if (password) {
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash(password, 10);

      await executeQuery(
        `
        INSERT INTO auth_accounts (user_id, username, password_hash)
        VALUES (?, ?, ?)
        `,
        [userId, username, passwordHash]
      );
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
