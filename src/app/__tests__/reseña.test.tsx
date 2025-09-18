import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReseñaComponente from '../componentes/reseña';
import * as ResenasActions from '../../actions/resenas.actions';
import { Reseña } from '../tipos/libro';

// Mockeo de server actions
vi.mock('../../actions/resenas.actions', () => ({
  obtenerResenasPorLibro: vi.fn(),
  agregarResena: vi.fn(),
  votarResena: vi.fn(),
  editarResena: vi.fn(),
}));

describe('ReseñaComponente', () => {
  const libroId = '123';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global de fetch para simular usuario
    global.fetch = vi.fn((url) => {
      if (url === '/api/auth/me') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: { id: 'user1', name: 'TestUser' } }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);
    }) as unknown as typeof fetch;
  });

  it('muestra "No hay reseñas aún" cuando no hay reseñas', async () => {
    (ResenasActions.obtenerResenasPorLibro as vi.Mock).mockResolvedValue([]);
    render(<ReseñaComponente libroId={libroId} titulo="Libro Test" />);
    expect(await screen.findByText('No hay reseñas aún.')).toBeInTheDocument();
  });

  it('muestra reseñas existentes correctamente', async () => {
    const mockReseñas: Reseña[] = [
      {
        _id: '1',
        idLibro: libroId,
        usuarioId: 'user1',
        usuario: 'Pepe',
        comentario: 'Excelente libro',
        valoracion: 5,
        likes: 2,
        dislikes: 0,
      },
      {
        _id: '2',
        idLibro: libroId,
        usuarioId: 'user2',
        usuario: 'Ana',
        comentario: 'No me gustó',
        valoracion: 2,
        likes: 0,
        dislikes: 1,
      },
    ];
    (ResenasActions.obtenerResenasPorLibro as vi.Mock).mockResolvedValue(mockReseñas);
    render(<ReseñaComponente libroId={libroId} titulo="Libro Test" />);

    // Espera a que aparezcan los textos de manera asíncrona
    expect(await screen.findByText('Pepe')).toBeInTheDocument();
    expect(await screen.findByText('5 ⭐')).toBeInTheDocument();
    expect(await screen.findByText('Excelente libro')).toBeInTheDocument();

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(await screen.findByText('2 ⭐')).toBeInTheDocument();
    expect(await screen.findByText('No me gustó')).toBeInTheDocument();
  });

  it('invoca agregarReseña al enviar el formulario', async () => {
    (ResenasActions.obtenerResenasPorLibro as vi.Mock).mockResolvedValue([]);
    (ResenasActions.agregarResena as vi.Mock).mockResolvedValue({ success: true });

    render(<ReseñaComponente libroId={libroId} titulo="Libro Test" />);

    const textarea = await screen.findByRole('textbox'); // textarea
    const boton = await screen.findByText('Agregar Reseña');

    await userEvent.type(textarea, 'Me encantó');
    await userEvent.click(boton);

    expect(ResenasActions.agregarResena).toHaveBeenCalled();
  });

  it('invoca votarReseña al hacer like/dislike', async () => {
    const mockReseñas: Reseña[] = [
      {
        _id: '1',
        idLibro: libroId,
        usuarioId: 'user1',
        usuario: 'Pepe',
        comentario: 'Muy bueno',
        valoracion: 4,
        likes: 0,
        dislikes: 0,
      },
    ];
    (ResenasActions.obtenerResenasPorLibro as vi.Mock).mockResolvedValue(mockReseñas);

    render(<ReseñaComponente libroId={libroId} titulo="Libro Test" />);

    const botonLike = await screen.findByText(/👍 0/);
    const botonDislike = await screen.findByText(/👎 0/);

    await userEvent.click(botonLike);
    await userEvent.click(botonDislike);

    expect(ResenasActions.votarResena).toHaveBeenCalledTimes(2);
  });
});
