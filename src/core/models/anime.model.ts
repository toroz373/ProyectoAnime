// Modelo de datos para un anime
// Define la estructura que debe tener cada anime
export interface Anime {
  id: number;        // ID único del anime en la base de datos local
  api_id: number;    // ID del anime en la API externa (MyAnimeList)
  title: string;     // Nombre del anime
  image: string;     // Ruta de la imagen del anime
  rating: number;    // Valoración promedio (1-5)
  description: string;  // Descripción o sinopsis del anime
  episodes: number;  // Número de capítulos
  isAiring: boolean; // Si el anime sigue en emisión
}

