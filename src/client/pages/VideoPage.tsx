import React, { useState, useMemo } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { VideoGrid } from '../components/VideoGrid';
import { VideoModal } from '../components/VideoModal';
import { Video, Category, CategoryOption } from '../../shared/models';
import './VideoPage.css'
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Художня праця',
    src: 'videos/1.mp4',
    image: './assets/image.png',
    category: 'artistic_work',
    description: 'Артіль "Художня праця": історія, що оживає у вишивці та зʼєднує покоління',
  },

  {
    id: '2',
    title: 'Микола Антонович Калетнік',
    src: 'videos/2.mp4',
    image: './assets/image.png',
    category: 'artistic_work',
    description: 'Микола Антонович Калетнік – директор фабрики "Жіноча праця" 1965-1997',
  },

  {
    id: '3',
    title: 'Основні орнаменти клембівської вишивки',
    src: 'videos/3.mp4',
    image: './assets/image.png',
    category: 'krembivska_embroidery',
    description: 'Основні орнаменти клембівської вишивки',
  },

  {
    id: '4',
    title: 'Галина Лялька',
    src: 'videos/4.mp4',
    image: './assets/image.png',
    category: 'artistic_work',
    description: 'Галина Лялька',
  }
];

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Всі відео' },
  { id: 'artistic_work', label: 'Художня праця' },
  { id: 'krembivska_embroidery', label: 'Клембівська вишивка' },
];

export const VideoPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_VIDEOS;
    return MOCK_VIDEOS.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="video-page">
      <div className="video-page__overlay" />

      <header className="video-header">
        <h1>Відеобібліотека музею вишиванки</h1>
        <p>Збереження українських традицій у цифрову епоху</p>
      </header>

      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <VideoGrid videos={filteredVideos} onVideoClick={setSelectedVideo} />

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
};
