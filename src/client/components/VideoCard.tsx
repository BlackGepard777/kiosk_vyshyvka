import React from 'react';
import { Video } from '../../shared/models';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => (
  <div className="video-card" onClick={() => onClick(video)}>
  <img src={video.preview || video.image || '/assets/image.png'} alt={video.title} />
    <div className="video-card-content">
      <div className="video-card-title">{video.title}</div>
      <div className="video-card-desc">{video.description}</div>
    </div>
  </div>
);
