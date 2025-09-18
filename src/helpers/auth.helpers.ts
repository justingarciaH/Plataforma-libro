// src/helpers/auth.helpers.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromToken() {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("No autenticado");

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; name: string };
  } catch {
    throw new Error("Token inválido");
  }
}