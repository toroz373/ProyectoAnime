// Modelo de datos para un comentario
// Define la estructura que debe tener cada comentario de un anime
export interface Comment {
  id: number;        // ID único del comentario
  animeId: number;   // ID del anime al que pertenece
  user: string;      // Nombre del usuario que comenta
  text: string;      // Texto del comentario
  rating: number;    // Valoración dada (1 a 5 estrellas)
}
