export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  ctaType?: string;
}

export interface CategoryCTA {
  title: string;
  description: string;
  buttonText: string;
  image: string;
}