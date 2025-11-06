import type { Video } from "../../shared/models";

const API_BASE = '/api/admin'

export const videosApi = {
    async getAll(): Promise<Video[]> {
        const response = await fetch (`${API_BASE}/videos`);
        if (!response.ok) throw new Error('Не вдалося завантажити відео');
        return response.json();
    },
    
    async getOne(id: string): Promise<Video> {
        const response = await fetch(`${API_BASE}/videos/${id}`);
        if (!response.ok) throw new Error('Не вдалося завантажити відео');
        return response.json();   
    },
    
    async create(video: Omit<Video, 'id' >): Promise<Video> {
        const response = await fetch(`${API_BASE}/videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(video)
            });
        if (!response.ok) throw new Error('Не вдалося створити відео');
        return response.json();
    },

    async update(id: string, video: Omit<Video, 'id' >): Promise<Video> {
        const response = await fetch(`${API_BASE}/videos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(video)
            });
        if (!response.ok) throw new Error('Не вдалося оновити відео');
        return response.json();
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE}/videos/${id}`, {
        method: 'DELETE'
        });
        if (!response.ok) throw new Error('Не вдалося видалити відео');
    }
};