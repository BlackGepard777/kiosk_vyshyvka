import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videosApi } from '../../api/video'; 
import './VideoEditorPage.css';

type VideoCategory = "artistic_work" | "krembivska_embroidery";

export function VideoEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<{
    title: string;
    category: VideoCategory | '';
    description: string;
  }>({
    title: '',
    category: '',
    description: ''
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingVideoSrc, setExistingVideoSrc] = useState<string>('');
  const [existingImageSrc, setExistingImageSrc] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadVideo(id);
    }
  }, [id]);

  const loadVideo = async (videoId: string) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/admin/videos/${videoId}`);

    const rawText = await response.text();
    console.log("Raw response:", rawText);

    if (!response.ok) {
      throw new Error(`Помилка: ${response.status}`);
    }

    const video = JSON.parse(rawText);
    setFormData({
      title: video.title,
      category: video.category as VideoCategory,
      description: video.description || ''
    });
    setExistingVideoSrc(video.src);
    setExistingImageSrc(video.image || '');
  } catch (err) {
    setError('Не вдалося завантажити відео');
    console.error("Помилка завантаження:", err);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      alert('Заповніть всі обов\'язкові поля');
      return;
    }

    if (!isEditMode && !videoFile) {
      alert('Додайте відео файл');
      return;
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);

      if (videoFile) {
        formDataToSend.append('video', videoFile);
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = isEditMode 
        ? `/api/admin/videos/${id}` 
        : '/api/admin/videos';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Помилка збереження');

      navigate('/admin');
    } catch (err) {
      alert('Не вдалося зберегти відео');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="video-editor-page">
      <div className="editor-header">
        <h1>{isEditMode ? 'Редагувати відео' : 'Додати нове відео'}</h1>
        <button onClick={() => navigate('/admin')} className="btn btn-secondary">
          ← Назад
        </button>
      </div>

      <form onSubmit={handleSubmit} className="video-form">
        <div className="form-group">
          <label htmlFor="title">
            Назва відео <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Введіть назву відео"
          />
        </div>

        <div className="form-group">
          <label htmlFor="video">
            Відео файл {!isEditMode && <span className="required">*</span>}
          </label>
          <input
            type="file"
            id="video"
            accept="video/mp4,video/webm,video/ogg"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
          {existingVideoSrc && (
            <div className="file-info">
              Поточне відео: {existingVideoSrc}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Зображення (прев'ю)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {existingImageSrc && !imageFile && (
            <div className="image-preview">
              <img src={existingImageSrc} alt="Поточне зображення" />
              <button 
                type="button" 
                onClick={async () => {
                  try {
                    setSaving(true);
                    const formDataToSend = new FormData();
                    formDataToSend.append('title', formData.title);
                    formDataToSend.append('category', formData.category);
                    formDataToSend.append('description', formData.description);
                    formDataToSend.append('removeImage', 'true');

                    const response = await fetch(`/api/admin/videos/${id}`, {
                      method: 'PUT',
                      body: formDataToSend
                    });

                    if (!response.ok) throw new Error('Помилка збереження');
                    setExistingImageSrc('');
                  } catch (err) {
                    alert('Не вдалося видалити зображення');
                    console.error(err);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="btn btn-small btn-delete"
                disabled={saving}
              >
                Видалити зображення
              </button>
            </div>
          )}
          {imageFile && (
            <div className="image-preview">
              <img src={URL.createObjectURL(imageFile)} alt="Нове зображення" />
              <button 
                type="button" 
                onClick={() => setImageFile(null)}
                className="btn btn-small btn-delete"
              >
                Скасувати вибір
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Категорія <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть категорію</option>
            <option value="artistic_work">Художні роботи</option>
            <option value="krembivska_embroidery">Кремпівська вишивка</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Опис</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Введіть опис відео"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Збереження...' : isEditMode ? 'Зберегти зміни' : 'Створити відео'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="btn btn-secondary"
            disabled={saving}
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoEditorPage;