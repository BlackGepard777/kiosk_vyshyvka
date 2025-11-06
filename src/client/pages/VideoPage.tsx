import React, { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { VideoGrid } from '../components/VideoGrid';
import { VideoModal } from '../components/VideoModal';
import { Video, Category, CategoryOption } from '../../shared/models';
import './VideoPage.css';
import useInactivityTimeout from '../../hooks/useInactivityTimeout';

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Всі відео' },
  { id: 'artistic_work', label: 'Художня праця' },
  { id: 'krembivska_embroidery', label: 'Клембівська вишивка' },
];

export const VideoPage: React.FC = () => {
  useInactivityTimeout(300, '/');

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/videos');
        if (!response.ok) throw new Error('Помилка завантаження відео');
        const data: Video[] = await response.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити відео');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return videos;
    return videos.filter(v => v.category === selectedCategory);
  }, [selectedCategory, videos]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (error) return <div className="error-message">{error}</div>;

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