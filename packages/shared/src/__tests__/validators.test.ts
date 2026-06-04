import { describe, expect, it } from "vitest";
import {
  emailSchema,
  passwordSchema,
  signUpSchema,
  signInSchema,
  createTodoSchema,
  updateTodoSchema,
} from "../validators";

describe("emailSchema", () => {
  it("accepts valid emails", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    expect(emailSchema.safeParse("a@b.co").success).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(emailSchema.safeParse("").success).toBe(false);
    expect(emailSchema.safeParse("@no-local.com").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts passwords >= 8 chars", () => {
    expect(passwordSchema.safeParse("12345678").success).toBe(true);
    expect(passwordSchema.safeParse("a-very-long-password").success).toBe(true);
  });

  it("rejects short passwords", () => {
    const result = passwordSchema.safeParse("short");
    expect(result.success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(passwordSchema.safeParse("").success).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("accepts valid sign-up data", () => {
    const result = signUpSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = signUpSchema.safeParse({
      name: "",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "User",
      email: "bad",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = signUpSchema.safeParse({
      name: "User",
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts valid sign-in data", () => {
    const result = signInSchema.safeParse({
      email: "test@example.com",
      password: "any",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createTodoSchema", () => {
  it("accepts valid title", () => {
    expect(createTodoSchema.safeParse({ title: "Buy milk" }).success).toBe(true);
  });

  it("rejects empty title", () => {
    expect(createTodoSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    expect(createTodoSchema.safeParse({ title: "x".repeat(201) }).success).toBe(false);
  });
});

describe("updateTodoSchema", () => {
  it("accepts partial updates", () => {
    expect(updateTodoSchema.safeParse({ completed: true }).success).toBe(true);
    expect(updateTodoSchema.safeParse({ title: "New" }).success).toBe(true);
    expect(updateTodoSchema.safeParse({}).success).toBe(true);
  });
});
