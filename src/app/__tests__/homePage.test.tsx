import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Principal from "../page";
import * as ServerActions from "../../actions/server-actions";
import { Libro } from "../tipos/libro";

// Mock del componente Carta
vi.mock("../app/componentes/portada", () => ({
  default: ({ libro }: { libro: Libro }) => <div data-testid="carta">{libro.titulo}</div>,
}));

// Mock de la acción fetchBooks
vi.mock("../../actions/server-actions", () => ({
  fetchBooks: vi.fn(),
}));

describe("Página Principal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título principal", async () => {
    const ui = await Principal({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByText(/Bienvenido a la biblioteca virtual Justito/i)).toBeInTheDocument();
    expect(screen.getByText(/porque te ofrecemos lo justo para leer/i)).toBeInTheDocument();
  });

  it("muestra los libros recibidos de fetchBooks", async () => {
    const librosMock = [
      { id: "1", titulo: "Libro 1", autor: ["Autor 1"] },
      { id: "2", titulo: "Libro 2", autor: ["Autor 2"] },
    ];
    vi.mocked(ServerActions.fetchBooks).mockResolvedValue(librosMock);

    const ui = await Principal({ searchParams: Promise.resolve({ q: "algo" }) });
    render(ui);


  expect(screen.getByText("Libro 1")).toBeInTheDocument();
  expect(screen.getByText("Libro 2")).toBeInTheDocument();
});

  it("maneja array vacío de libros", async () => {
    vi.mocked(ServerActions.fetchBooks).mockResolvedValue([]);

    const ui = await Principal({ searchParams: Promise.resolve({ q: "nada" }) });
    render(ui);

    expect(screen.queryAllByTestId("carta")).toHaveLength(0);
  });

  it("usa correctamente la query de searchParams", async () => {
    const librosMock = [{ id: "3", titulo: "Libro Buscado", autor: ["Autor X"] }];
    vi.mocked(ServerActions.fetchBooks).mockResolvedValue(librosMock);

    const ui = await Principal({ searchParams: Promise.resolve({ q: "Buscado" }) });
    render(ui);

  // buscamos directamente el texto del título
  expect(screen.getByText("Libro Buscado")).toBeInTheDocument();

  // opcional: también podés validar el autor
  expect(screen.getByText("Autor X")).toBeInTheDocument();

  // verificamos que fetchBooks se haya llamado con el query correcto
  expect(ServerActions.fetchBooks).toHaveBeenCalledWith("Buscado");
});
});
