import { describe, vi, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "./page";
import { fetchBooks } from "../../actions/server-actions";
import { Libro } from "../tipos/libro";

vi.mock("../../actions/server-actions", () => ({
  fetchBooks: vi.fn(),
}));

// Mock del componente Carta
vi.mock("../componentes/portada", () => ({
  default: ({ libro }: { libro: Libro} ) => <div data-testid="carta">{libro.titulo}</div>,
})); //ahora si funciona

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título con la query", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([
      { id: "1", titulo: "Libro Test", autor: ["Autor X"], imagen: "" },
    ]);

    const ui = await SearchPage({ searchParams: Promise.resolve({ q: "test" }) });
    render(ui);

    expect(await screen.findByText(/Resultados para: test/i)).toBeInTheDocument();
  });

  it("muestra libros cuando fetchBooks devuelve resultados", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([
      { id: "1", titulo: "Libro Test", autor: ["Autor X"], imagen: "" },
      { id: "2", titulo: "Otro Libro", autor: ["Autor Y"], imagen: "" },
    ]);

    const ui = await SearchPage({ searchParams: Promise.resolve({ q: "harry" }) });
    render(ui);

    const cartas = await screen.findAllByTestId("carta");
    expect(cartas).toHaveLength(2);
    expect(cartas[0]).toHaveTextContent("Libro Test");
    expect(cartas[1]).toHaveTextContent("Otro Libro");
  });

  it("muestra mensaje cuando no hay resultados", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([]);

    const ui = await SearchPage({ searchParams: Promise.resolve({ q: "nada" }) });
    render(ui);

    expect(await screen.findByText(/No se encontraron libros/i)).toBeInTheDocument();
  });

  it("maneja caso sin query", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([]);

    const ui = await SearchPage({ searchParams: Promise.resolve({}) });
    render(ui);

    // Ahora el título esperado es "Ingresa una búsqueda"
    expect(await screen.findByText(/Ingresa una búsqueda/i)).toBeInTheDocument();
    // No debe renderizar cartas
    expect(screen.queryAllByTestId("carta")).toHaveLength(0);
  });
});
