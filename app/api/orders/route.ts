import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Order, OrderItem } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    let query = "SELECT * FROM orders";
    const values: any[] = [];
    let paramIndex = 1;

    // Start building WHERE clause if needed
    const conditions: string[] = [];

    if (id) {
      conditions.push(`id = $${paramIndex}`);
      values.push(id);
      paramIndex++;
    }

    if (userId) {
      conditions.push(`"userId" = $${paramIndex}`);
      values.push(userId);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    // Add WHERE clause if any conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add pagination
    query += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, values);

    // If a specific order ID was requested, also fetch its items
    if (id && result.rows.length > 0) {
      const itemsQuery = `
        SELECT oi.*, p.name, p.imageUrl 
        FROM order_items oi
        JOIN products p ON oi."productId" = p.id
        WHERE oi."orderId" = $1
      `;
      const itemsResult = await pool.query(itemsQuery, [id]);

      return NextResponse.json({
        order: result.rows[0],
        items: itemsResult.rows,
      });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch orders: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.userId || !body.shippingAddressId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId and shippingAddressId are required",
        },
        { status: 400 },
      );
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get the user's cart
      const cartQuery = 'SELECT * FROM carts WHERE "userId" = $1';
      const cartResult = await client.query(cartQuery, [body.userId]);

      if (cartResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "No cart found for this user" },
          { status: 404 },
        );
      }

      const cart = cartResult.rows[0];

      // Get cart items
      const cartItemsQuery = `
        SELECT ci.*, p.price, p.name 
        FROM cart_items ci
        JOIN products p ON ci."productId" = p.id
        WHERE ci."cartId" = $1
      `;
      const cartItemsResult = await client.query(cartItemsQuery, [cart.id]);

      if (cartItemsResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of cartItemsResult.rows) {
        totalAmount += item.price * item.quantity;
      }

      // Create order
      const now = new Date();
      const orderQuery = `
        INSERT INTO orders (
          "userId", status, "totalAmount", "shippingAddressId", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const orderValues = [
        body.userId,
        "pending", // Default status
        totalAmount,
        body.shippingAddressId,
        now,
        now,
      ];

      const orderResult = await client.query(orderQuery, orderValues);
      const newOrder = orderResult.rows[0];

      // Create order items
      const orderItems = [];
      for (const item of cartItemsResult.rows) {
        const orderItemQuery = `
          INSERT INTO order_items (
            "orderId", "productId", quantity, price, "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        const orderItemValues = [
          newOrder.id,
          item.productId,
          item.quantity,
          item.price,
          now,
          now,
        ];

        const orderItemResult = await client.query(
          orderItemQuery,
          orderItemValues,
        );
        orderItems.push(orderItemResult.rows[0]);

        // Update product stock
        await client.query(
          'UPDATE products SET stock = stock - $1, "updatedAt" = $2 WHERE id = $3',
          [item.quantity, now, item.productId],
        );
      }

      // Clear the cart
      await client.query('DELETE FROM cart_items WHERE "cartId" = $1', [
        cart.id,
      ]);

      await client.query("COMMIT");

      return NextResponse.json(
        {
          order: newOrder,
          items: orderItems,
        },
        { status: 201 },
      );
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create order: ${error}` },
      { status: 500 },
    );
  }
}
