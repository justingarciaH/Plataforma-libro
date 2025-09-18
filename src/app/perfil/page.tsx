import { obtenerFavoritos } from "@/actions/favoritos.actions";
import { leerResenas } from "@/actions/resenas.actions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No autenticado");
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; name: string };
}

export default async function PerfilPage() {
  const user = await getUserFromToken();
  const favoritos = await obtenerFavoritos();
  const userResenas = user
    ? await leerResenas().then(resenas => resenas.filter(r => r.usuarioId === user.id))
    : [];

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-[#008080] h-40 flex justify-center items-center relative">
        <h1 className="text-3xl md:text-5xl font-bold text-white z-10">
          Perfil <span className="text-[#FFD700]">Personal</span>
        </h1>
      </header>
      <main className="p-6 md:p-16 -mt-24 z-20 relative">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || "Usuario"}</h2>
          </div>

          <section className="p-8">
            <h2 className="text-gray-800 text-xl font-semibold">📝 Mis Reseñas</h2>
            {userResenas.length > 0 ? (
              userResenas.map(r => (
                <div key={r._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <p className=" text-gray-800 font-bold">
                    Nombre del libro:
                    {(r.tituloLibro as string) || 'Título no disponible'}</p>
                  <p className=" text-gray-800 font-extralight">
                    {r.comentario}</p>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500 italic">No has escrito reseñas aún.</p>
            )}
          </section>

          <section className="p-8">
            <h2 className="text-gray-800 text-xl font-semibold">❤️ Mis Favoritos</h2>
            {favoritos.length > 0 ? (
              favoritos.map(f => (
                <div key={f._id.toString()} className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <p className=" text-green-600 font-bold">
                    Nombre de los libros:</p>
                  <p className="font-medium text-gray-700">☑ {f.titulo}</p>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500 italic">No tienes libros favoritos.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
