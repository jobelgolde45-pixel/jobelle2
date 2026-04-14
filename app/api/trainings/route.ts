import { NextRequest, NextResponse } from "next/server";
import { getAll, executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogType = searchParams.get("catalogType");
    const competencyType = searchParams.get("competencyType");
    const isActive = searchParams.get("isActive");

    let sql = `
      SELECT 
        tp.id,
        tp.code,
        tp.title,
        tp.catalog_type,
        tp.competency_type,
        tp.level,
        tp.duration_text,
        tp.description,
        tp.outline,
        tp.target_audience,
        tp.service_provider,
        tp.delivery_mode,
        tp.cost_text,
        tp.external_link,
        tp.image_url,
        tp.is_active,
        tp.created_at
      FROM training_programs tp
      WHERE 1=1
    `;
    const args: any[] = [];

    if (catalogType) {
      sql += ` AND tp.catalog_type = ?`;
      args.push(catalogType);
    }

    if (competencyType) {
      sql += ` AND tp.competency_type = ?`;
      args.push(competencyType);
    }

    if (isActive !== null && isActive !== undefined) {
      sql += ` AND tp.is_active = ?`;
      args.push(parseInt(isActive));
    }

    sql += ` ORDER BY tp.title ASC`;

    const programs = await getAll(sql, args);

    return NextResponse.json({
      success: true,
      data: programs.map((p: any) => ({
        id: String(p.id),
        code: p.code,
        title: p.title,
        catalogType: p.catalog_type,
        competencyType: p.competency_type,
        level: p.level,
        duration: p.duration_text,
        description: p.description,
        outline: p.outline,
        targetAudience: p.target_audience,
        provider: p.service_provider,
        mode: p.delivery_mode,
        cost: p.cost_text,
        externalLink: p.external_link,
        image: p.image_url,
        isActive: p.is_active === 1,
      })),
    });
  } catch (error) {
    console.error("Get training programs error:", error);
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
      code,
      title,
      catalogType,
      competencyType,
      level,
      duration,
      description,
      outline,
      targetAudience,
      provider,
      mode,
      cost,
      externalLink,
      image,
    } = body;

    if (!code || !title || !catalogType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `
      INSERT INTO training_programs (
        code, title, catalog_type, competency_type, level, duration_text,
        description, outline, target_audience, service_provider, delivery_mode,
        cost_text, external_link, image_url, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        code,
        title,
        catalogType,
        competencyType || null,
        level || null,
        duration || null,
        description,
        outline || null,
        targetAudience || null,
        provider || null,
        mode || null,
        cost || null,
        externalLink || null,
        image || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create training program error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
