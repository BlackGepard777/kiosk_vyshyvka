import React from 'react';
import { VideoCard } from './VideoCard';
import { Video } from '../../shared/models';

interface VideoGridProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, onVideoClick }) => (
  <div className="video-grid">
    {videos.map(v => (
      <VideoCard key={v.id} video={v} onClick={onVideoClick} />
    ))}
  </div>
);
