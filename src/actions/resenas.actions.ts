  "use server";

  import { connectDB } from '../db/db';
  import { ObjectId, UpdateFilter } from 'mongodb';
  import { Reseña } from '../app/tipos/libro';
  import { revalidatePath } from 'next/cache';
  import { getUserFromToken } from "@/helpers/auth.helpers";

type ResenaMongo = Omit<Reseña, "_id"> & { _id: ObjectId };

  // leer todas las reseñas
  export async function leerResenas(): Promise<Reseña[]> {
    const db = await connectDB();
  const resenasCollection = db.collection<ResenaMongo>('resenas');

    const resenasConId = await resenasCollection.find().toArray();
    return resenasConId.map((resena) => ({
      ...resena,
      _id: resena._id.toString() // Convertimos a string
    }));
  }

  // agregar reseña
  export async function agregarResena(formData: FormData): Promise<void> {
    const user = await getUserFromToken();

    const nuevaResena: Omit<Reseña, "_id"> = {
      idLibro: formData.get('idLibro') as string,
      tituloLibro: formData.get("tituloLibro") as string,
      usuarioId: user.id,
      usuario: user.name,
      valoracion: Number(formData.get('valoracion')),
      comentario: formData.get('comentario') as string,
      likes: 0,
      dislikes: 0,
    };

    const db = await connectDB();

    const nuevaResenaMongo: ResenaMongo = {
    ...nuevaResena,
    _id: new ObjectId()
  };


    await db.collection<ResenaMongo>('resenas').insertOne(nuevaResenaMongo); 
    revalidatePath(`/book/${nuevaResena.idLibro}`);
  }

  // obtener reseñas por libro
  export async function obtenerResenasPorLibro(idLibro: string): Promise<Reseña[]> {
    const db = await connectDB();
    const resenasCollection = db.collection<ResenaMongo>('resenas');

    const resenasConId = await resenasCollection.find({ idLibro }).toArray();
    return resenasConId.map((resena) => ({
      ...resena,
      _id: resena._id.toString()
    }));
  }

  // votar reseña
  export async function votarResena(formData: FormData) {
    const id = formData.get("id") as string;
    const tipo = formData.get("tipo") as "like" | "dislike";

    const db = await connectDB();
    const user = await getUserFromToken();
  
    const resenasCollection = db.collection<ResenaMongo>('resenas');

    const resena = await resenasCollection.findOne({ _id: new ObjectId(id) });
    if (!resena) throw new Error("Reseña no encontrada");

    if (resena.votos?.[user.id]) throw new Error("Ya has votado esta reseña");

    const update: UpdateFilter<ResenaMongo> = {
      $set: { [`votos.${user.id}`]: tipo },
      $inc: tipo === "like" ? { likes: 1 } : { dislikes: 1 },
    };

    await resenasCollection.updateOne({ _id: new ObjectId(id) }, update);

    revalidatePath(`/book/${resena.idLibro}`);
    return { success: true, tipo };
  }

  // editar reseña
  export async function editarResena(id: string, comentario: string, valoracion: number) {
    const db = await connectDB();
    const user = await getUserFromToken();
  const resenasCollection = db.collection<ResenaMongo>('resenas');

    const resena = await resenasCollection.findOne({ _id: new ObjectId(id) });
    if (!resena) throw new Error('Reseña no encontrada');
    if (resena.usuarioId !== user.id) throw new Error('No autorizado');

   const update: UpdateFilter<ResenaMongo> = { $set: { comentario, valoracion } };
  await resenasCollection.updateOne({ _id: new ObjectId(id) }, update);

  revalidatePath(`/book/${resena.idLibro}`);
}

  // eliminar reseña
  export async function eliminarResena(id: string) {
    const db = await connectDB();
    const user = await getUserFromToken();
  const resenasCollection = db.collection<ResenaMongo>('resenas');

    const resena = await resenasCollection.findOne({ _id: new ObjectId(id) });
    if (!resena) throw new Error('Reseña no encontrada');
    if (resena.usuarioId !== user.id) throw new Error('No autorizado');

    await resenasCollection.deleteOne({ _id: new ObjectId(id) });
    revalidatePath(`/book/${resena.idLibro}`);
  }
