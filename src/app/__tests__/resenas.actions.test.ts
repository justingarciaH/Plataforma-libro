// src/app/__tests__/resenas.actions.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";

// 🔹 Mock de revalidatePath de Next.js
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// 🔹 Mock de connectDB (Mongo)
const mockInsertOne = vi.fn();
const mockFind = vi.fn();
const mockFindOne = vi.fn();
const mockUpdateOne = vi.fn();
const mockDeleteOne = vi.fn();

vi.mock("../../db/db", () => ({
  connectDB: vi.fn().mockResolvedValue({
    collection: vi.fn().mockReturnValue({
      insertOne: mockInsertOne,
      find: mockFind,
      findOne: mockFindOne,
      updateOne: mockUpdateOne,
      deleteOne: mockDeleteOne,
    }),
  }),
}));

// 🔹 Mock de getUserFromToken
vi.mock("@/helpers/auth.helpers", () => ({
  getUserFromToken: vi.fn().mockResolvedValue({ id: "user123", name: "Pepe" }),
}));

describe("Reseñas Actions CRUD", () => {
  let ResenasActions: typeof import("../../actions/resenas.actions");

  beforeEach(async () => {
    vi.clearAllMocks();
    ResenasActions = await import("../../actions/resenas.actions"); // import dinámico
  });

  it("📖 leerResenas devuelve todas las reseñas", async () => {
    mockFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: new ObjectId("507f1f77bcf86cd799439011"),
          idLibro: "libro1",
          tituloLibro: "Título 1",
          usuarioId: "user123",
          usuario: "Pepe",
          valoracion: 5,
          comentario: "Excelente",
          likes: 2,
          dislikes: 0,
        },
      ]),
    });

    const resenas = await ResenasActions.leerResenas();
    expect(resenas).toHaveLength(1);
    expect(resenas[0].tituloLibro).toBe("Título 1");
  });

  it("agregarResena inserta una reseña", async () => {
    const formData = new FormData();
    formData.set("idLibro", "libro1");
    formData.set("tituloLibro", "Título 1");
    formData.set("comentario", "Muy bueno");
    formData.set("valoracion", "5");

    await ResenasActions.agregarResena(formData);

    expect(mockInsertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        idLibro: "libro1",
        tituloLibro: "Título 1",
        usuarioId: "user123",
        usuario: "Pepe",
        comentario: "Muy bueno",
        valoracion: 5,
      })
    );
  });

  it("📚 obtenerResenasPorLibro devuelve reseñas filtradas", async () => {
    mockFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: new ObjectId("507f1f77bcf86cd799439012"),
          idLibro: "libro1",
          tituloLibro: "Título 1",
          usuarioId: "user123",
          usuario: "Pepe",
          valoracion: 4,
          comentario: "Interesante",
          likes: 1,
          dislikes: 0,
        },
      ]),
    });

    const resenas = await ResenasActions.obtenerResenasPorLibro("libro1");
    expect(resenas).toHaveLength(1);
    expect(resenas[0].idLibro).toBe("libro1");
  });

  it("👍 votarResena actualiza likes correctamente", async () => {
    mockFindOne.mockResolvedValueOnce({
      _id: new ObjectId("507f1f77bcf86cd799439013"),
      idLibro: "libro1",
      usuarioId: "otroUser",
      votos: {},
      likes: 0,
      dislikes: 0,
    });

    const formData = new FormData();
    formData.set("id", "507f1f77bcf86cd799439013");
    formData.set("tipo", "like");

    await ResenasActions.votarResena(formData);

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: new ObjectId("507f1f77bcf86cd799439013") },
      expect.objectContaining({
        $inc: { likes: 1 },
      })
    );
  });

  it("✏️ editarResena modifica comentario y valoracion", async () => {
    mockFindOne.mockResolvedValueOnce({
      _id: new ObjectId("507f1f77bcf86cd799439014"),
      idLibro: "libro1",
      usuarioId: "user123",
      comentario: "Viejo",
      valoracion: 3,
    });

    await ResenasActions.editarResena(
      "507f1f77bcf86cd799439014",
      "Nuevo comentario",
      5
    );

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: new ObjectId("507f1f77bcf86cd799439014") },
      { $set: { comentario: "Nuevo comentario", valoracion: 5 } }
    );
  });

  it("🗑 eliminarResena borra una reseña", async () => {
    mockFindOne.mockResolvedValueOnce({
      _id: new ObjectId("507f1f77bcf86cd799439015"),
      idLibro: "libro1",
      usuarioId: "user123",
    });

    await ResenasActions.eliminarResena("507f1f77bcf86cd799439015");

    expect(mockDeleteOne).toHaveBeenCalledWith({
      _id: new ObjectId("507f1f77bcf86cd799439015"),
    });
  });
});
