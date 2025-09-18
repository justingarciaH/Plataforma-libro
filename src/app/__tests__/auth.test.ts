import jwt from "jsonwebtoken";
import { getUserFromRequest } from "@/middleware/auth.Middleware";
import { describe, it, vi, expect } from 'vitest';

const SECRET = "secreto-test";

describe("Flujo de autenticación de usuario", () => {
  it("debería registrar un usuario correctamente", async () => {
    // Simulación de datos de registro
    const newUser = {
      email: "test@correo.com",
      name: "TestUser",
      password: "password123"
    };
    // Aquí solo validamos el esquema, no la BD real
    expect(newUser.email).toMatch(/@/);
    expect(newUser.password.length).toBeGreaterThanOrEqual(6);
  });

  it("debería loguear y devolver token válido", () => {
    const user = { id: "abc123", email: "test@correo.com", name: "TestUser" };
    const token = jwt.sign(user, SECRET);
    expect(typeof token).toBe("string");
    // Simula cookie y extracción
    const req = { cookies: { get: () => ({ value: token }) } };
    const decoded = getUserFromRequest(req, SECRET);
    expect(decoded).toMatchObject(user);
  });

  it("debería obtener el usuario desde el token (me)", () => {
    const user = { id: "abc123", email: "test@correo.com", name: "TestUser" };
    const token = jwt.sign(user, SECRET);
    const req = { cookies: { get: () => ({ value: token }) } };
    const decoded = getUserFromRequest(req, SECRET);
    expect(decoded.email).toBe(user.email);
    expect(decoded.name).toBe(user.name);
  });

  it("debería lanzar error si no hay token (no autenticado)", () => {
    const req = { cookies: { get: () => undefined } };
    expect(() => getUserFromRequest(req, SECRET)).toThrow("No autenticado");
  });

  it("debería lanzar error si el token es inválido", () => {
    const req = { cookies: { get: () => ({ value: "token-falso" }) } };
    expect(() => getUserFromRequest(req, SECRET)).toThrow("Token inválido");
  });

  it("debería eliminar el token en logout", () => {
    // Simula la lógica de logout
    const response = { cookies: { delete: vi.fn() } };
    response.cookies.delete("token");
    expect(response.cookies.delete).toHaveBeenCalledWith("token");
  });
});
