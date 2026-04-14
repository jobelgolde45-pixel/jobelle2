import { NextRequest, NextResponse } from "next/server";
import { getAll, getOne, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let sql = `
      SELECT * FROM job_analysis_forms
      WHERE 1=1
    `;
    const args: any[] = [];

    if (userId) {
      sql += ` AND submitter_user_id = ?`;
      args.push(parseInt(userId));
    }

    sql += ` ORDER BY created_at DESC`;

    const forms = await getAll(sql, args);

    return NextResponse.json({
      success: true,
      data: forms.map((f: any) => ({
        id: String(f.id),
        formNumber: f.form_number,
        fullname: f.fullname,
        position: f.position_title,
        office: f.office_name,
        section: f.section_name,
        alternate: f.alternate_position,
        purpose: f.purpose,
        mainDuties: f.main_duties,
        tools: f.tools_and_equipment,
        challenges: f.challenges,
        comments: f.comments,
        signature: f.signature_data_url,
        dateSubmitted: f.date_submitted,
        isRead: f.is_read === 1,
        createdAt: f.created_at,
      })),
    });
  } catch (error) {
    console.error("Get job analysis forms error:", error);
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
      formNumber,
      submitterUserId,
      officeName,
      fullname,
      positionTitle,
      sectionName,
      alternatePosition,
      purpose,
      mainDuties,
      toolsAndEquipment,
      challenges,
      comments,
      signatureDataUrl,
      dateSubmitted,
      secondaryDuties,
      skills,
    } = body;

    if (!formNumber || !fullname) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get office_id
    let officeId = null;
    if (officeName) {
      const officeResult = await getOne(
        "SELECT id FROM offices WHERE name = ?",
        [officeName]
      );
      officeId = officeResult ? officeResult.id : null;
    }

    const result = await executeQuery(
      `
      INSERT INTO job_analysis_forms (
        form_number, submitter_user_id, office_id, fullname, position_title,
        office_name, section_name, alternate_position, purpose, main_duties,
        tools_and_equipment, challenges, comments, signature_data_url,
        date_submitted, is_read
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [
        formNumber,
        submitterUserId ? parseInt(submitterUserId) : null,
        officeId,
        fullname,
        positionTitle || null,
        officeName || null,
        sectionName || null,
        alternatePosition || null,
        purpose || null,
        mainDuties || null,
        toolsAndEquipment || null,
        challenges || null,
        comments || null,
        signatureDataUrl || null,
        dateSubmitted || null,
      ]
    );

    const formId = result.lastInsertRowid;

    // Insert secondary duties
    if (secondaryDuties && secondaryDuties.length > 0) {
      for (const duty of secondaryDuties) {
        await executeQuery(
          `
          INSERT INTO job_analysis_secondary_duties (
            job_analysis_form_id, duty_text, frequency_text, sort_order
          ) VALUES (?, ?, ?, ?)
          `,
          [formId, duty.dutyText, duty.frequencyText || null, duty.sortOrder || 0]
        );
      }
    }

    // Insert skills
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await executeQuery(
          `
          INSERT INTO job_analysis_skills (
            job_analysis_form_id, skill_name, level_text, sort_order
          ) VALUES (?, ?, ?, ?)
          `,
          [formId, skill.skillName, skill.levelText || null, skill.sortOrder || 0]
        );
      }
    }

    return NextResponse.json({ success: true, formId });
  } catch (error) {
    console.error("Create job analysis form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
