import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, R2_BUCKET } from "../lib/r2";
import { authMiddleware } from "../middleware/auth";
import type { AuthEnv } from "../types";

export const uploads = new Hono<AuthEnv>();

uploads.use("*", authMiddleware);

// POST /uploads/presign — request a pre-signed upload URL
uploads.post("/presign", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    filename: string;
    contentType: string;
  }>();

  if (!body.filename || !body.contentType) {
    throw new HTTPException(400, {
      message: "filename and contentType are required",
    });
  }

  const key = `${user.id}/${Date.now()}-${body.filename}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: body.contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 600, // 10 minutes
  });

  return c.json({ uploadUrl, key });
});

// POST /uploads/confirm — confirm upload completed, return a GET URL
uploads.post("/confirm", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{ key: string }>();

  if (!body.key) {
    throw new HTTPException(400, { message: "key is required" });
  }

  // Verify the object belongs to this user
  if (!body.key.startsWith(`${user.id}/`)) {
    throw new HTTPException(403, { message: "Forbidden" });
  }

  // Verify the object exists in R2
  try {
    await getR2Client().send(
      new HeadObjectCommand({ Bucket: R2_BUCKET, Key: body.key })
    );
  } catch {
    throw new HTTPException(404, { message: "Object not found in storage" });
  }

  return c.json({ key: body.key, confirmed: true });
});

// GET /uploads/:key{.+} — get a pre-signed download URL
uploads.get("/:key{.+}", async (c) => {
  const user = c.get("user");
  const key = c.req.param("key");

  // Verify ownership
  if (!key.startsWith(`${user.id}/`)) {
    throw new HTTPException(403, { message: "Forbidden" });
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  const downloadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 3600, // 1 hour
  });

  return c.json({ downloadUrl, key });
});

// DELETE /uploads/:key{.+} — delete an object
uploads.delete("/:key{.+}", async (c) => {
  const user = c.get("user");
  const key = c.req.param("key");

  if (!key.startsWith(`${user.id}/`)) {
    throw new HTTPException(403, { message: "Forbidden" });
  }

  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })
  );

  return c.json({ deleted: true });
});
