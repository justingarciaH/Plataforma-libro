// src/app/__tests__/crud.test.ts
import { describe, it, vi, beforeEach, expect } from "vitest";
import { FormData } from "formdata-node";

// Mockear revalidatePath de Next.js
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mockear la conexión a la DB
vi.mock("../../db/db", () => ({
  connectDB: vi.fn(),
}));

// Mockear getUserFromToken antes de importar acciones
vi.mock("@/helpers/auth.helpers", () => ({
  getUserFromToken: vi.fn().mockResolvedValue({ id: "user1", name: "Usuario" }),
}));

import * as resenasActions from "@/actions/resenas.actions";
import { connectDB } from "../../db/db";
import { getUserFromToken } from "@/helpers/auth.helpers";

describe("Operaciones CRUD de reseñas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getUserFromToken as vi.Mock).mockResolvedValue({ id: "user1", name: "Usuario" });
  });

  it("agrega una reseña", async () => {
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        insertOne: vi.fn().mockResolvedValue({ insertedId: "64b64b64b64b64b64b64b64b" }),
      }),
    };
    (connectDB as vi.Mock).mockResolvedValue(mockDb);

    const formData = new FormData();
    formData.set("idLibro", "123");
    formData.set("tituloLibro", "Libro Test");
    formData.set("valoracion", "5");
    formData.set("comentario", "Comentario");

    await expect(resenasActions.agregarResena(formData)).resolves.toBeUndefined();
  });

  it("lee reseñas", async () => {
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        find: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([
            {
              _id: "64b64b64b64b64b64b64b64b",
              idLibro: "123",
              tituloLibro: "Libro Test",
              usuarioId: "user1",
              usuario: "Usuario",
              valoracion: 5,
              comentario: "Test",
              likes: 0,
              dislikes: 0,
            },
          ]),
        }),
      }),
    };
    (connectDB as vi.Mock).mockResolvedValue(mockDb);

    const reseñas = await resenasActions.leerResenas();
    expect(reseñas[0].comentario).toBe("Test");
  });

  it("elimina reseña", async () => {
    const mockObjectId = "64b64b64b64b64b64b64b64b"; // 24 chars para ObjectId
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        findOne: vi.fn().mockResolvedValue({ _id: mockObjectId, usuarioId: "user1", idLibro: "123" }),
        deleteOne: vi.fn().mockResolvedValue({}),
      }),
    };
    (connectDB as vi.Mock).mockResolvedValue(mockDb);

    await expect(resenasActions.eliminarResena(mockObjectId)).resolves.toBeUndefined();
  });
});
