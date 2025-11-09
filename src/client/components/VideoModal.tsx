import React, { useRef, useEffect, useState } from 'react';
import { Video } from '../../shared/models';
import { Maximize, Minimize, X } from 'lucide-react';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const timer = setTimeout(() => {
        const tracks = videoRef.current?.textTracks;
        if (tracks && tracks.length > 0) {
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = 'showing';
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [video]);

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

  const isVideoFile = /\.(mp4|webm|ogg)$/i.test(video.src);
  const subtitles = video?.subtitles || [];
  
  return (
    <div 
      ref={modalRef}
      className={`video-modal ${isFullscreen ? 'video-modal--fullscreen' : ''}`}
      onClick={handleClose}
    >
      <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="video-wrapper">
          {isVideoFile ? (
            <video
              ref={videoRef}
              src={video.src}
              controls
              crossOrigin="anonymous"
              controlsList="nodownload nopictureinpicture"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              {subtitles.map((subtitle) => (
                <track
                  key={subtitle.language}
                  kind="subtitles"
                  src={subtitle.src}
                  srcLang={subtitle.language}
                  label={subtitle.label}
                />
              ))}
            </video>
          ) : (
            <iframe
              src={`${video.src}`}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
            />
          )}

          <div className={`block-logo ${isFullscreen ? 'block-logo--fullscreen' : ''}`}></div>
          <div className={`block-title ${isFullscreen ? 'block-title--fullscreen' : ''}`}></div>
          <div className={`block-actions ${isFullscreen ? 'block-actions--fullscreen' : ''}`}></div>
        </div>

        <div className='video-modal-title'> *Для виходу клікніть за рамками відео</div>
      </div>
    </div>
  );
};