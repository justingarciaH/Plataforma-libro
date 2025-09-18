import { agregarResena } from '../../../actions/resenas.actions';

export async function POST(req: Request) {
  const formData = await req.formData(); // Leer los datos del formulario
  try {
    await agregarResena(formData); // Llamada a la Server Action
    return new Response('Reseña agregada', { status: 200 });
  } catch {
    return new Response('Error al agregar reseña', { status: 500 });
  }
}
