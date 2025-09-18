import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL!);
const db = client.db(process.env.MONGO_DB_NAME);

export async function GET(request: NextRequest) {
  // Obtenemos el token JWT desde las cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }); // 👈 neutro en vez de 401
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    // Buscamos el usuario en la base de datos
    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ user: null }); // 👈 neutro en vez de 401
    }

    // Devolvemos la información del usuario
    return NextResponse.json({
      user: {
      id: user._id.toString(),   // 👈 necesario para comparaciones
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
