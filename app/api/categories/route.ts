import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Category } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    let query = "SELECT * FROM categories";
    const values: any[] = [];
    let paramIndex = 1;

    // Start building WHERE clause if needed
    const conditions: string[] = [];

    if (parentId) {
      conditions.push(`"parentId" = $${paramIndex}`);
      values.push(parentId);
      paramIndex++;
    }

    if (search) {
      conditions.push(
        `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`,
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Add WHERE clause if any conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add pagination
    query += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch categories: ${error}` },
      { status: 500 },
    );
  }
}
