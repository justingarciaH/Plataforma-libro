'use client';

import { useEffect, useState } from 'react';
import { marcarFavorito, esFavorito } from "@/actions/favoritos.actions";

export default function FavoriteButton({ bookId, titulo }: { bookId: string; titulo: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    try {
      const result = await marcarFavorito(bookId, titulo);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar favoritos');
    }
  };

  useEffect(() => {
    async function fetchFavorite() {
      const fav = await esFavorito(bookId);
      setIsFavorite(fav);
    }
    fetchFavorite();
  }, [bookId]);

  return (
    <button
      onClick={handleFavoriteClick}
      className={`px-4 py-2 rounded ${isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-black"}`}
    >
      {isFavorite ? "❤️ Quitar de favoritos" : "🤍 Marcar como favorito"}
    </button>
  );
}
