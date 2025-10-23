import React, { useState, useMemo } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { VideoGrid } from '../components/VideoGrid';
import { VideoModal } from '../components/VideoModal';
import { Video, Category, CategoryOption } from '../../shared/models';
import './VideoPage.css'

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'tutorials',
    description: 'Історія, символіка та традиції української вишивки',
  },

  {
    id: '2',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'tutorials',
    description: 'Історія, символіка та традиції української вишивки',
  },

  {
    id: '3',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'tutorials',
    description: 'Історія, символіка та традиції української вишивки',
  },

  {
    id: '4',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'tutorials',
    description: 'Історія, символіка та традиції української вишивки',
  },

  {
    id: '5',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'tutorials',
    description: 'Історія, символіка та традиції української вишивки',
  },

  {
    id: '6',
    title: 'Мистецтво української вишиванки',
    youtubeId: 'D3IylubwYxo',
    image: 'https://img.youtube.com/vi/D3IylubwYxo/mqdefault.jpg',
    category: 'reviews',
    description: 'Історія, символіка та традиції української вишивки',
  }
];

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Всі відео' },
  { id: 'tutorials', label: 'Уроки' },
  { id: 'reviews', label: 'Огляди' },
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
