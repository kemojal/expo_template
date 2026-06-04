import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db, schema, eq } from "@repo/db";
import { authMiddleware } from "../middleware/auth";
import type { AuthEnv } from "../types";

export const todos = new Hono<AuthEnv>();

// All todo routes require authentication
todos.use("*", authMiddleware);

// GET /todos — list current user's todos
todos.get("/", async (c) => {
  const user = c.get("user");
  const result = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.userId, user.id));
  return c.json(result);
});

// GET /todos/:id — get single todo
todos.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const [todo] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  if (!todo || todo.userId !== user.id) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  return c.json(todo);
});

// POST /todos — create todo
todos.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    id: string;
    title: string;
  }>();

  const [todo] = await db
    .insert(schema.todos)
    .values({
      id: body.id,
      title: body.title,
      userId: user.id,
    })
    .returning();

  return c.json(todo, 201);
});

// PATCH /todos/:id — update todo
todos.patch("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json<{
    title?: string;
    completed?: boolean;
  }>();

  const [existing] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  if (!existing || existing.userId !== user.id) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  const [todo] = await db
    .update(schema.todos)
    .set(body)
    .where(eq(schema.todos.id, id))
    .returning();

  return c.json(todo);
});

// DELETE /todos/:id — delete todo
todos.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const [existing] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  if (!existing || existing.userId !== user.id) {
    throw new HTTPException(404, { message: "Todo not found" });
  }

  await db.delete(schema.todos).where(eq(schema.todos.id, id));

  return c.json({ deleted: true });
});
