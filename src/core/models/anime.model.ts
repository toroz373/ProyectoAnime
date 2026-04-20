// Modelo de datos para un anime
// Define la estructura que debe tener cada anime
export interface Anime {
  id: number;        // ID único del anime
  title: string;     // Nombre del anime
  image: string;     // Ruta de la imagen
  rating: number;    // Valoración promedio (1-5)
  description: string;  // Descripción corta del anime
  episodes: number;  // Número de capítulos
  isAiring: boolean; // Si sigue en emisión
}
