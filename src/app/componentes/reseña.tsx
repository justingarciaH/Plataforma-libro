"use client";
import { Reseña } from "../tipos/libro";
import { agregarResena, obtenerResenasPorLibro, votarResena, editarResena } from "../../actions/resenas.actions";
import { useEffect, useState } from "react";

interface ReseñaProps {
  libroId: string;
  titulo: string;
}

export default function ReseñaComponente({ libroId, titulo }: ReseñaProps) {
  const [reseñas, setResenas] = useState<Reseña[]>([]);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComentario, setEditComentario] = useState("");
  const [editValoracion, setEditValoracion] = useState<number>(3);

  useEffect(() => {
    async function fetchData() {
      const resResenas = await obtenerResenasPorLibro(libroId);
      setResenas(resResenas);

      const resUser = await fetch("/api/auth/me");
      if (resUser.ok) {
        const userData = await resUser.json();
        setUser(userData.user || null);
      }
    }
    fetchData();
  }, [libroId]);

  const handleSubmit = async (formData: FormData) => {
    await agregarResena(formData);
    const updatedReseñas = await obtenerResenasPorLibro(libroId);
    setResenas(updatedReseñas);
  };

  const handleVoto = async (id: string, tipo: "like" | "dislike") => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("tipo", tipo);
    await votarResena(formData);

    const updatedReseñas = await obtenerResenasPorLibro(libroId);
    setResenas(updatedReseñas);
  };

  const handleEditar = async (id: string) => {
    await editarResena(id, editComentario, editValoracion);
    setEditingId(null);
    const updatedReseñas = await obtenerResenasPorLibro(libroId);
    setResenas(updatedReseñas);
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md" style={{ color: "#cd8c52" }}>
      <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

      {user && (
        <form
          action={handleSubmit}
          className="mb-4"
        >
          <input type="hidden" name="idLibro" value={libroId} />
          <input type="hidden" name="tituloLibro" value={titulo} />

          <textarea name="comentario" className="w-full p-2 mb-4 rounded-md border-2" required />
          <div className="flex gap-2 mb-4">
            <select name="valoracion" className="p-2 rounded-md border-2">
              {[1, 2, 3, 4, 5].map((valor) => (
                <option key={valor} value={valor}>
                  {valor} Estrella{valor > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 rounded-md bg-[#cd8c52] text-white">
              Agregar Reseña
            </button>
          </div>
        </form>
      )}

      <div className="reseñas mt-6">
        {reseñas.length > 0 ? (
          reseñas.map((reseña) => (
            <div key={reseña._id} className="mb-4 p-4 border-b">
              {editingId === reseña._id ? (
                <div>
                  <textarea
                    value={editComentario}
                    onChange={(e) => setEditComentario(e.target.value)}
                    className="w-full p-2 mb-2 rounded-md border-2"
                  />
                  <select
                    value={editValoracion}
                    onChange={(e) => setEditValoracion(Number(e.target.value))}
                    className="p-2 rounded-md border-2 mb-2"
                  >
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <option key={valor} value={valor}>
                        {valor} Estrella{valor > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button onClick={() => handleEditar(reseña._id)} 
                    className="px-3 py-1 bg-green-500 text-white rounded">
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{reseña.usuario}</span>
                      <span className="text-gray-500">{reseña.valoracion} ⭐</span>
                    </div>
                    
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleVoto(reseña._id, "like")}>👍 {reseña.likes}</button>
                      <button onClick={() => handleVoto(reseña._id, "dislike")}>👎 {reseña.dislikes}</button>
                      {user && reseña.usuarioId === user.id && (
                        <button onClick={() => {
                        setEditingId(reseña._id)
                        setEditComentario(reseña.comentario)
                        setEditValoracion(reseña.valoracion)
                        }}
                        className="ml-2 text-blue-500">
                          ✏️ Editar
                        </button>
                      )}
                    </div>
                  </div>
                  <p>{reseña.comentario}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay reseñas aún.</p>
        )}
      </div>
    </div>
  );
}
