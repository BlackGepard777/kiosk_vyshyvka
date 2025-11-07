import './AdminPage.css' 
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavLink, Outlet } from "react-router";
import { AuthorizedRoute, useAuth } from "./AuthorizedRoute";
import type { Video } from '../../shared/models';
import { videosApi } from '../api/video';

function AdminAvatar() {
  const { user } = useAuth();
  return (
    <div className="admin-avatar">
      <a href="/api/auth/logout" onClick={(e) => {
        e.preventDefault();
        window.location.href = '/api/auth/logout';
      }} className="logout">
        {user?.picture ? (
          <img src={user.picture} alt={user.email || "Admin Avatar"} />
        ) : (
          <span className="default-avatar">A</span>
        )}
      </a>
    </div>
  );
}

export function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videosApi.getAll();
      setVideos(data);
    } catch (err) {
      setError('Не вдалося завантажити відео');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це відео?')) return;
    
    try {
      await videosApi.delete(id);
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      alert('Не вдалося видалити відео');
      console.error(err);
    }
  };

    return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Адмін-панель</h2>
          <AdminAvatar />
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Управління відео</h1>
          <Link to="/admin/videos/new" className="btn btn-primary">
            + Додати відео
          </Link>
        </div>

        {loading && <div className="loading">Завантаження...</div>}
        
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="videos-table">
            <table>
              <thead>
                <tr>
                  <th>Зображення</th>
                  <th>Назва</th>
                  <th>Категорія</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      Відео ще немає. Додайте перше відео!
                    </td>
                  </tr>
                ) : (
                  videos.map(video => (
                    <tr key={video.id}>
                      <td>
                        {video.image ? (
                          <img src={video.image} alt={video.title} className="video-thumbnail" />
                        ) : (
                          <div className="video-thumbnail-placeholder">📹</div>
                        )}
                      </td>
                      <td>{video.title}</td>
                      <td>{video.category}</td>
                      <td className="actions">
                        <Link to={`/admin/videos/${video.id}/edit`} className="btn btn-small btn-edit">
                          Редагувати
                        </Link>
                        <button 
                          onClick={() => handleDelete(video.id)} 
                          className="btn btn-small btn-delete"
                        >
                          Видалити
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;