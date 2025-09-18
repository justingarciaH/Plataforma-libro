import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) throw new Error("No autenticado");
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; name: string };
}

// GET usando URLSearchParams para capturar bookId desde la ruta
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const bookId = url.pathname.split("/").pop(); // último segmento de la ruta
  if (!bookId) return NextResponse.json({ error: "bookId faltante" }, { status: 400 });

  const user = getUserFromToken(request);
  const db = await connectDB();
  const favs = db.collection("favoritos");

  const existe = await favs.findOne({ usuarioId: user.id, bookId });
  return NextResponse.json({ isFavorite: !!existe });
}

// POST usando URLSearchParams para capturar bookId desde la ruta
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const bookId = url.pathname.split("/").pop();
  if (!bookId) return NextResponse.json({ error: "bookId faltante" }, { status: 400 });

  try {
    const { titulo } = await request.json();
    const user = getUserFromToken(request);
    const db = await connectDB();
    const favs = db.collection("favoritos");

    const existe = await favs.findOne({ usuarioId: user.id, bookId });
    if (existe) {
      await favs.deleteOne({ _id: new ObjectId(existe._id) });
      return NextResponse.json({ message: "Eliminado de favoritos", isFavorite: false });
    } else {
      await favs.insertOne({ usuarioId: user.id, usuario: user.name, bookId, titulo });
      return NextResponse.json({ message: "Agregado a favoritos", isFavorite: true });
    }
  } catch (error) {
    console.error("Error en favoritos", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
