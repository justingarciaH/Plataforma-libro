// Validación de reseñas para test
export function validarResena({ comentario, valoracion }: { comentario: string, valoracion: number }) {
  if (!comentario || comentario.trim().length === 0) {
    return { success: false, error: 'Comentario requerido' };
  }
  if (typeof valoracion !== 'number' || valoracion < 1 || valoracion > 5) {
    return { success: false, error: 'Valoración fuera de rango' };
  }
  return { success: true };
}
