import { describe, expect, it } from "bun:test";
import {
  signUpSchema,
  signInSchema,
  createTodoSchema,
} from "@repo/shared";

describe("signUpSchema (mobile)", () => {
  it("validates correct input", () => {
    const result = signUpSchema.safeParse({
      name: "Test",
      email: "test@test.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "Test",
      email: "bad",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema (mobile)", () => {
  it("requires non-empty password", () => {
    const result = signInSchema.safeParse({
      email: "test@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createTodoSchema (mobile)", () => {
  it("rejects empty title", () => {
    expect(createTodoSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("accepts valid title", () => {
    expect(createTodoSchema.safeParse({ title: "Buy milk" }).success).toBe(true);
  });
});
