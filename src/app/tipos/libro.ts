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
  id: string
  idLibro: string
  usuario: string
  valoracion: number  // 1-5
  comentario: string
  likes: number 
  dislikes: number
}
