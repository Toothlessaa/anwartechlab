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
