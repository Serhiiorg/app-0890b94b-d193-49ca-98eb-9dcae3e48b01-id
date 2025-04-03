import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Product } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    let query = 'SELECT * FROM products WHERE "isActive" = true';
    const values: any[] = [];

    if (category) {
      query += ' AND "categoryId" = $1';
      values.push(category);
    }

    if (search) {
      const searchIndex = values.length + 1;
      query += ` AND (name ILIKE $${searchIndex} OR description ILIKE $${searchIndex})`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY "createdAt" DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch products: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "price",
      "imageUrl",
      "categoryId",
      "stock",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate price is a number
    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 },
      );
    }

    // Validate stock is a number
    if (typeof body.stock !== "number" || body.stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a non-negative number" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO products (
        name, description, price, "imageUrl", "categoryId", stock, "isActive", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const now = new Date();
    const values = [
      body.name,
      body.description,
      body.price,
      body.imageUrl,
      body.categoryId,
      body.stock,
      true, // isActive defaults to true
      now,
      now,
    ];

    const result = await pool.query(query, values);
    const newProduct = result.rows[0];

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create product: ${error}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if product exists
    const checkQuery = "SELECT * FROM products WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [body.id]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const updatableFields = [
      "name",
      "description",
      "price",
      "imageUrl",
      "categoryId",
      "stock",
      "isActive",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updateFields.push(`"${field}" = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    // Add updatedAt
    updateFields.push(`"updatedAt" = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    // Add id as the last parameter
    values.push(body.id);

    const query = `
      UPDATE products 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update product: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Soft delete by setting isActive to false
    const query = `
      UPDATE products 
      SET "isActive" = false, "updatedAt" = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [new Date(), id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product successfully deactivated",
      product: result.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete product: ${error}` },
      { status: 500 },
    );
  }
}
