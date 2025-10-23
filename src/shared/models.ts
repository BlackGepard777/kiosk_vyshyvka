export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  image?: string;
  category: 'tutorials' | 'reviews';
  description: string;
}

export type Category = 'all' | 'tutorials' | 'reviews';

export type CategoryOption = {
  id: Category;
  label: string;
}