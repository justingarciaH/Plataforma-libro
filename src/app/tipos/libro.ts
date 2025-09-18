import { ObjectId } from "mongodb"

export interface User { 
  _id: string,
  email: string,
  name: string,
  password: string,
  createdAt: Date
}
 
export interface Libro {
  id: string
  titulo: string
  autor: string[]
  descripcion?: string
  imagen?: string
  fechaPublicacion?: string
  numPaginas?: number
  categorias?: string[]
}


export interface Reseña {
  _id: string;
  idLibro: string
  usuarioId: string
  usuario: string
  valoracion: number  // 1-5 en escala de estrellas ...
  comentario: string
  likes: number 
  dislikes: number
  tituloLibro?: string // Título del libro al que pertenece la reseña
  votos?: Record<string, "like" | "dislike">; // 👈 agregado
}

export interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
  };
}

