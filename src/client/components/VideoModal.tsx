import React, { useRef, useEffect } from 'react';
import { Video } from '../../shared/models';
import { Maximize, Minimize, X } from 'lucide-react';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!modalRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await modalRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Помилка повноекранного режиму:', err);
    }
  };

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    onClose();
  };

  if (!video) return null;
  
  return (
    <div 
      ref={modalRef}
      className={`video-modal ${isFullscreen ? 'video-modal--fullscreen' : ''}`}
      onClick={handleClose}
    >
      <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="video-wrapper">
          <iframe
            src={`${video.src}`}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          />

          <div className={`block-logo ${isFullscreen ? 'block-logo--fullscreen' : ''}`}></div>
          <div className={`block-title ${isFullscreen ? 'block-title--fullscreen' : ''}`}></div>
          <div className={`block-actions ${isFullscreen ? 'block-actions--fullscreen' : ''}`}></div>
        </div>

        
      </div>
    </div>
  );
};