// src/app/__tests__/bookPage.test.tsx
import { render, screen } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import BookPage from "../book/[id]/page";

// mock de next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

// mock de db
vi.mock("../db/db", () => ({
  __esModule: true,
  connectDB: vi.fn().mockResolvedValue({
    collection: vi.fn().mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([
          {
            _id: { toString: () => "resena1" },
            idLibro: "123",
            tituloLibro: "El Quijote",
            usuarioId: "user1",
            usuario: "Usuario 1",
            valoracion: 5,
            comentario: "Muy bueno",
            likes: 2,
            dislikes: 0,
          },
        ]),
      }),
    }),
  }),
  getDB: vi.fn(),
}));

// mock de ReseñaComponente
vi.mock("../componentes/reseña", () => ({
  __esModule: true,
  default: ({ libroId }: { libroId: string }) => (
    <div data-testid="resenas">Reseñas de {libroId}</div>
  ),
}));

// mock de FavoriteButton
vi.mock("../componentes/favorito", () => ({
  __esModule: true,
  default: ({ bookId }: { bookId: string }) => (
    <button data-testid="favorito">Favorito {bookId}</button>
  ),
}));

// mock de obtenerResenasPorLibro
vi.mock("../../actions/resenas.actions", () => ({
  __esModule: true,
  obtenerResenasPorLibro: vi.fn().mockResolvedValue([
    {
      _id: "resena1",
      idLibro: "123",
      tituloLibro: "El Quijote",
      usuarioId: "user1",
      usuario: "Usuario 1",
      valoracion: 5,
      comentario: "Muy bueno",
      likes: 2,
      dislikes: 0,
    },
  ]),
}));

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la información del libro cuando fetch devuelve datos válidos", async () => {
    // mock de fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        volumeInfo: {
          title: "El Quijote",
          authors: ["Cervantes"],
          description: "Un libro clásico",
          publishedDate: "1605",
          pageCount: 863,
          categories: ["Novela"],
          imageLinks: {
            thumbnail: "http://prueba.com/thumb.jpg",
          },
        },
      }),
    }) as unknown as typeof fetch;

    // render del componente pasando params como Promise
    render(await BookPage({ params: Promise.resolve({ id: "123" }) }));

    // assertions
    expect(await screen.findByText("El Quijote")).toBeInTheDocument();
    expect(screen.getByText("Cervantes")).toBeInTheDocument();
    expect(screen.getByText(/Un libro clásico/)).toBeInTheDocument();
    expect(screen.getByText(/1605/)).toBeInTheDocument();
    expect(screen.getByText(/863/)).toBeInTheDocument();
    expect(screen.getByText(/Novela/)).toBeInTheDocument();

    // reseñas mockeadas
    expect(screen.getByTestId("resenas")).toHaveTextContent("Reseñas de 123");

    // botón favorito mockeado
    expect(screen.getByTestId("favorito")).toHaveTextContent("Favorito 123");
  });

  it("llama a notFound si fetch falla", async () => {
    const { notFound } = await import("next/navigation");

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as unknown as typeof fetch;

    await BookPage({ params: Promise.resolve({ id: "fail" }) });

    expect(notFound).toHaveBeenCalled();
  });
});
