export interface Article {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  description?: string;
  author?: string;
  timeAgo?: string;
  url?: string;
  source?: string;
}
