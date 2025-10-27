export type Video = {
  id: string;
  title: string;
  src: string;
  image?: string;
  category: 'artistic_work' | 'krembivska_embroidery';
  description: string;
}

export type Category = 'all' | 'artistic_work' | 'krembivska_embroidery';

export type CategoryOption = {
  id: Category;
  label: string;
}