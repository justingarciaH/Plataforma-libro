import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Principal from './page';
import * as ServerActions from '../actions/server-actions';
import { Libro } from "./tipos/libro";

// Mock del componente Carta
vi.mock('../app/componentes/portada', () => ({
  default: ({ libro }: { libro: Libro}) => <div data-testid="carta">{libro.titulo}</div>,
}));

// Mock de la acción fetchBooks
vi.mock('../actions/server-actions', () => ({
  fetchBooks: vi.fn(),
}));

describe('Página Principal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el título principal', async () => {
    (ServerActions.fetchBooks as unknown as jest.MockedFunction<typeof ServerActions.fetchBooks>).mockResolvedValue([]);

    render(await Principal({}));

    expect(screen.getByText(/Bienvenido a la biblioteca virtual Justito/i)).toBeInTheDocument();
    expect(screen.getByText(/porque te ofrecemos lo justo para leer/i)).toBeInTheDocument();
  });

  it('muestra los libros recibidos de fetchBooks', async () => {
    const librosMock = [
    { id: '1', titulo: 'Libro 1', autor: ['Autor 1'] },
    { id: '1', titulo: 'Libro 1', autor: ['Autor 1'] },
    ];
  (ServerActions.fetchBooks as unknown as jest.MockedFunction<typeof ServerActions.fetchBooks>)
  .mockResolvedValue(librosMock);

    render(await Principal({}));

    const cartas = screen.getAllByTestId('carta');
    expect(cartas).toHaveLength(2);
    expect(cartas[0]).toHaveTextContent('Libro 1');
    expect(cartas[1]).toHaveTextContent('Libro 2');
  });

  it('maneja array vacío de libros', async () => {
    (ServerActions.fetchBooks  as unknown as jest.MockedFunction<typeof ServerActions.fetchBooks>).mockResolvedValue([]);

    render(await Principal({}));

    expect(screen.queryAllByTestId('carta')).toHaveLength(0);
  });

  it('usa correctamente la query de searchParams', async () => {
    const librosMock = [{ id: '3', titulo: 'Libro Buscado', autor: ['Autor X'] }];
  (ServerActions.fetchBooks as unknown as jest.MockedFunction<typeof ServerActions.fetchBooks>)
  .mockResolvedValue(librosMock);

    const searchParams = { q: 'Buscado' };
    render(await Principal({ searchParams }));

    const carta = screen.getByTestId('carta');
    expect(carta).toHaveTextContent('Libro Buscado');
    expect(ServerActions.fetchBooks).toHaveBeenCalledWith('Buscado');
  });
});
