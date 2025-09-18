import { NextResponse, NextRequest } from "next/server";
import { authMiddleware } from "../../middleware/auth.Middleware";
import { vi, describe, beforeEach, it, expect } from "vitest";
import jwt from "jsonwebtoken"


describe("Middleware autorización", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV, JWT_SECRET: "secreto-test" };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("permite acceso con token válido", () => {
    const token = jwt.sign({ id: "123" }, process.env.JWT_SECRET!);
    const req = new NextRequest("http://localhost/perfil", {
      headers: { cookie: `token=${token}` }
    });
    // Simula pathname
    Object.defineProperty(req, "nextUrl", {
      value: { pathname: "/perfil" },
      writable: true
    });
    const res = authMiddleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it("redirecciona sin token", () => {
    const req = new NextRequest("http://localhost/perfil");
    Object.defineProperty(req, "nextUrl", {
      value: { pathname: "/perfil" },
      writable: true
    });
    const res = authMiddleware(req);
    expect(res.headers.get("location")).toBe("http://localhost/login");  });
});
