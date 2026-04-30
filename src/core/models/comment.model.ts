// Modelo de datos para un comentario
export interface Comment {
  id?: number;           // ID único del comentario
  anime_id: number;      // ID del anime al que pertenece
  user_id: number;       // ID del usuario que escribió
  user_link?: string;    // Link del usuario (@usuario)
  content: string;       // Contenido del comentario
  rating: number;        // Valoración dada (1-5)
  created_at?: string;   // Fecha de creación
}
