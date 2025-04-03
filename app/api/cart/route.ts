import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Cart, CartItem } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // First, get the cart for the user
    const cartQuery = 'SELECT * FROM carts WHERE "userId" = $1';
    const cartResult = await pool.query(cartQuery, [userId]);

    // If no cart exists, return empty cart
    if (cartResult.rows.length === 0) {
      return NextResponse.json({ cart: null, items: [] });
    }

    const cart = cartResult.rows[0];

    // Get all cart items
    const itemsQuery = `
      SELECT ci.*, p.name, p.price, p.imageUrl 
      FROM cart_items ci
      JOIN products p ON ci."productId" = p.id
      WHERE ci."cartId" = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [cart.id]);

    return NextResponse.json({
      cart,
      items: itemsResult.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch cart: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.userId || !body.productId || !body.quantity) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, productId, and quantity are required",
        },
        { status: 400 },
      );
    }

    if (typeof body.quantity !== "number" || body.quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 },
      );
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the user has a cart, create one if not
      let cartResult = await client.query(
        'SELECT * FROM carts WHERE "userId" = $1',
        [body.userId],
      );

      let cart: Cart;
      if (cartResult.rows.length === 0) {
        // Create a new cart
        const now = new Date();
        const newCartResult = await client.query(
          'INSERT INTO carts ("userId", "createdAt", "updatedAt") VALUES ($1, $2, $3) RETURNING *',
          [body.userId, now, now],
        );
        cart = newCartResult.rows[0];
      } else {
        cart = cartResult.rows[0];
      }

      // Check if the product is already in the cart
      const cartItemResult = await client.query(
        'SELECT * FROM cart_items WHERE "cartId" = $1 AND "productId" = $2',
        [cart.id, body.productId],
      );

      let cartItem: CartItem;
      if (cartItemResult.rows.length === 0) {
        // Add new item to cart
        const now = new Date();
        const newItemResult = await client.query(
          'INSERT INTO cart_items ("cartId", "productId", quantity, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [cart.id, body.productId, body.quantity, now, now],
        );
        cartItem = newItemResult.rows[0];
      } else {
        // Update existing item quantity
        const now = new Date();
        const updateItemResult = await client.query(
          'UPDATE cart_items SET quantity = $1, "updatedAt" = $2 WHERE id = $3 RETURNING *',
          [body.quantity, now, cartItemResult.rows[0].id],
        );
        cartItem = updateItemResult.rows[0];
      }

      // Update cart's updatedAt timestamp
      await client.query('UPDATE carts SET "updatedAt" = $1 WHERE id = $2', [
        new Date(),
        cart.id,
      ]);

      await client.query("COMMIT");
      return NextResponse.json(cartItem, { status: 201 });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to add item to cart: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 },
      );
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get the cart item to check if it exists
      const cartItemResult = await client.query(
        "SELECT * FROM cart_items WHERE id = $1",
        [cartItemId],
      );

      if (cartItemResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Cart item not found" },
          { status: 404 },
        );
      }

      const cartItem = cartItemResult.rows[0];

      // Delete the cart item
      await client.query("DELETE FROM cart_items WHERE id = $1", [cartItemId]);

      // Update cart's updatedAt timestamp
      await client.query('UPDATE carts SET "updatedAt" = $1 WHERE id = $2', [
        new Date(),
        cartItem.cartId,
      ]);

      await client.query("COMMIT");
      return NextResponse.json({
        message: "Item removed from cart successfully",
        cartItemId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to remove item from cart: ${error}` },
      { status: 500 },
    );
  }
}
