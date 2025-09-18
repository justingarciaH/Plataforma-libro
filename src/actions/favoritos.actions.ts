"use server";

import { connectDB } from '../db/db';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No autenticado");
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; name: string };
}

// 🔹 Toggle favoritos (agregar o eliminar)
export async function marcarFavorito(bookId: string, titulo: string) {
  const user = await getUserFromToken();
  const db = await connectDB();

  const favs = db.collection('favoritos');
  const existe = await favs.findOne({ usuarioId: user.id, bookId });

  if (existe) {
    await favs.deleteOne({ _id: new ObjectId(existe._id) });
    return { isFavorite: false, message: 'Eliminado de favoritos' };
  } else {
    await favs.insertOne({ usuarioId: user.id, usuario: user.name, bookId, titulo });
    return { isFavorite: true, message: 'Agregado a favoritos' };
  }
}

// 🔹 Saber si un libro ya es favorito
export async function esFavorito(bookId: string) {
  const user = await getUserFromToken();
  const db = await connectDB();

  const favs = db.collection('favoritos');
  const existe = await favs.findOne({ usuarioId: user.id, bookId });

  return !!existe;
}

// 🔹 Obtener lista de favoritos del usuario
export async function obtenerFavoritos() {
  const user = await getUserFromToken();
  const db = await connectDB();
  return db.collection('favoritos').find({ usuarioId: user.id }).toArray();
}
