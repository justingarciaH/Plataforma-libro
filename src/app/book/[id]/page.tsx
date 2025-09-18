// src/app/book/[id]/page.tsx
import { notFound } from "next/navigation";
import ReseñaComponente from "../../componentes/reseña";
import { GoogleBooksItem } from "@/app/tipos/libro";
import FavoriteButton from "@/app/componentes/favorito";
import { obtenerResenasPorLibro } from "@/actions/resenas.actions";

// Función para obtener libro de Google Books (mantenida en el servidor)
async function getBook(id: string): Promise<GoogleBooksItem | null> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
    next: { revalidate: 3600 }, // Cacheo por 1 hora
  });

  if (!res.ok) return null;
  const data: GoogleBooksItem = await res.json();
  return data;
}

type BookPageProps = {
  params: Promise<{ id: string }>; 
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) return notFound();

  const info = book.volumeInfo;
  const resenas = await obtenerResenasPorLibro(id);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{info.title}</h1>
      <p className="text-lg">{info.authors?.join(", ")}</p>

      {/* Portada */}
      {info.imageLinks?.thumbnail ? (
        <img
          src={info.imageLinks.thumbnail}
          alt={info.title}
          className="w-auto h-auto max-w-[120px] max-h-[180px]"
        />
      ) : (
        <div className="w-48 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Sin portada
        </div>
      )}

      {/* Descripción */}
      <p className="mt-4">{info.description || "Sin descripción disponible."}</p>

      {/* Detalles */}
      <ul className="mt-4 text-sm text-white">
        <li>
          <span className="text-[#fcf7d3]">Fecha de publicación:</span>{" "}
          {info.publishedDate || "N/A"}
        </li>
        <li>
          <span className="text-[#fcf7d3]">Número de páginas:</span>{" "}
          {info.pageCount || "N/A"}
        </li>
        <li>
          <span className="text-[#fcf7d3]">Categorías:</span>{" "}
          {info.categories?.join(", ") || "N/A"}
        </li>
      </ul>

    <FavoriteButton bookId={id} titulo={info.title} />

      {/* Reseñas */}
      <ReseñaComponente libroId={id} titulo={info.title} />
    </main>
  );
}
