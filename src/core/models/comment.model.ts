export interface Comment {
  id?: number;
  anime_id: number;
  user_id: number;
  user_link?: string;
  content: string;
  rating: number;
  created_at?: string;
}
