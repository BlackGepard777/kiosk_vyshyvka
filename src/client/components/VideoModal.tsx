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
        <div className="video-modal__controls">
          <button 
            className="video-modal__button video-modal__button--fullscreen"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Війти в повноекранний режим' : 'Повноекранний режим'}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
          <button 
            className="video-modal__button video-modal__button--close"
            onClick={handleClose}
            title="Закрити"
          >
            <X size={24} />
          </button>
        </div>

        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title={video.title}
          />

          <div className={`block-logo ${isFullscreen ? 'block-logo--fullscreen' : ''}`}></div>
          <div className={`block-title ${isFullscreen ? 'block-title--fullscreen' : ''}`}></div>
          <div className={`block-actions ${isFullscreen ? 'block-actions--fullscreen' : ''}`}></div>
        </div>

        {!isFullscreen && (
          <h3 className="video-modal__title">{video.title}</h3>
        )}
      </div>
    </div>
  );
};