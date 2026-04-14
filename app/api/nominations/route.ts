import { NextRequest, NextResponse } from "next/server";
import { getAll, getOne, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const formType = searchParams.get("formType");

    let sql = `
      SELECT 
        a.*,
        u.username as applicant_username
      FROM applications a
      LEFT JOIN users u ON a.applicant_user_id = u.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status) {
      sql += ` AND a.status = ?`;
      args.push(status);
    }

    if (userId) {
      sql += ` AND a.applicant_user_id = ?`;
      args.push(parseInt(userId));
    }

    if (formType) {
      sql += ` AND a.form_type = ?`;
      args.push(formType);
    }

    sql += ` ORDER BY a.created_at DESC`;

    const applications = await getAll(sql, args);

    return NextResponse.json({
      success: true,
      data: applications.map((a: any) => ({
        id: String(a.id),
        applicationNumber: a.application_number,
        title: a.title,
        status: a.status,
        formType: a.form_type,
        applicantName: a.applicant_name,
        applicantUsername: a.applicant_username || a.applicant_username,
        email: a.email,
        position: a.position_title,
        office: a.office_name,
        supervisor: a.supervisor_name,
        dateCourse: a.date_course,
        dateSubmitted: a.date_submitted,
        venue: a.venue,
        competencyType: a.competency_type,
        justification: a.justification,
        memoHtml: a.memo_html,
        memoMode: a.memo_mode,
        memoProvider: a.memo_provider,
        userSignature: a.user_signature_data_url,
        adminSignature: a.admin_signature_data_url,
        isRead: a.is_read === 1,
        isAdminRead: a.is_admin_read === 1,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      })),
    });
  } catch (error) {
    console.error("Get applications error:", error);
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
      applicationNumber,
      applicantUserId,
      programId,
      sessionId,
      title,
      competencyType,
      dateSubmitted,
      dateFiling,
      dateCourse,
      venue,
      applicantName,
      applicantUsername,
      employeeIdNumber,
      email,
      positionTitle,
      supervisorName,
      officeName,
      officeHead,
      dateHired,
      employmentStatus,
      salaryGrade,
      serviceLength,
      contactNumber,
      gender,
      oicName,
      alternateParticipantJson,
      justification,
      userSignatureDataUrl,
    } = body;

    if (!applicationNumber || !title || !applicantName || !officeName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get office_id if office_name is provided
    let officeId = null;
    if (officeName) {
      const officeResult = await getOne(
        "SELECT id FROM offices WHERE name = ?",
        [officeName]
      );
      officeId = officeResult ? officeResult.id : null;
    }

    await executeQuery(
      `
      INSERT INTO applications (
        application_number, applicant_user_id, office_id, program_id, session_id,
        form_type, status, title, competency_type, date_submitted, date_filing,
        date_course, venue, applicant_name, applicant_username, employee_id_number,
        email, position_title, supervisor_name, office_name, office_head,
        date_hired, employment_status, salary_grade, service_length, contact_number,
        gender, oic_name, alternate_participant_json, justification,
        user_signature_data_url, is_read, is_admin_read
      ) VALUES (?, ?, ?, ?, ?, 'nomination', 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
      `,
      [
        applicationNumber,
        applicantUserId ? parseInt(applicantUserId) : null,
        officeId,
        programId ? parseInt(programId) : null,
        sessionId ? parseInt(sessionId) : null,
        title,
        competencyType || null,
        dateSubmitted || null,
        dateFiling || null,
        dateCourse || null,
        venue || null,
        applicantName,
        applicantUsername || null,
        employeeIdNumber || null,
        email || null,
        positionTitle || null,
        supervisorName || null,
        officeName,
        officeHead || null,
        dateHired || null,
        employmentStatus || null,
        salaryGrade || null,
        serviceLength || null,
        contactNumber || null,
        gender || null,
        oicName || null,
        alternateParticipantJson || null,
        justification || null,
        userSignatureDataUrl || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, memoHtml, memoMode, memoProvider, memoDate, memoTimeIn, memoTimeOut, adminSignatureDataUrl, isRead, isAdminRead } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (status) {
      updates.push("status = ?");
      args.push(status);
    }

    if (memoHtml !== undefined) {
      updates.push("memo_html = ?");
      args.push(memoHtml);
    }

    if (memoMode !== undefined) {
      updates.push("memo_mode = ?");
      args.push(memoMode);
    }

    if (memoProvider !== undefined) {
      updates.push("memo_provider = ?");
      args.push(memoProvider);
    }

    if (memoDate !== undefined) {
      updates.push("memo_date = ?");
      args.push(memoDate);
    }

    if (memoTimeIn !== undefined) {
      updates.push("memo_time_in = ?");
      args.push(memoTimeIn);
    }

    if (memoTimeOut !== undefined) {
      updates.push("memo_time_out = ?");
      args.push(memoTimeOut);
    }

    if (adminSignatureDataUrl !== undefined) {
      updates.push("admin_signature_data_url = ?");
      args.push(adminSignatureDataUrl);
    }

    if (isRead !== undefined) {
      updates.push("is_read = ?");
      args.push(isRead ? 1 : 0);
    }

    if (isAdminRead !== undefined) {
      updates.push("is_admin_read = ?");
      args.push(isAdminRead ? 1 : 0);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    args.push(id);

    await executeQuery(
      `UPDATE applications SET ${updates.join(", ")} WHERE id = ?`,
      args
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
