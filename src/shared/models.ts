export type Video = {
  id: string;
  title: string;
  src: string;
  image?: string;
  preview?: string;
  category: 'artistic_work' | 'krembivska_embroidery';
  description: string;
  subtitles?: Subtitle[];
}

export type Category = 'all' | 'artistic_work' | 'krembivska_embroidery';

export type CategoryOption = {
  id: Category;
  label: string;
}

export type Subtitle = {
  language: string;
  label: string;
  src: string;
}