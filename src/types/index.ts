export type Project = {
  id: string;
  title: string;
  category: string;
  filter: string;
  description: string;
  story?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  tech: string[];
  image: string;
  size: string;
  link?: string;
  github?: string;
  created_at?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  description: string;
  image: string;
  images: string[];
  date: string;
  created_at?: string;
};

export type Highlight = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date_text: string;
  location: string;
  href: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HighlightInput = Pick<Highlight, 'title' | 'subtitle' | 'description' | 'date_text' | 'location' | 'href' | 'image_url' | 'is_active'>;
