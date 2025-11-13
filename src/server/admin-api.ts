import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import multer from 'multer';
import path, { join, resolve } from 'path';
import { videos } from './db';
import type { Video } from '../shared/models';
import ffmpeg from 'fluent-ffmpeg';
import { rejects } from 'assert';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, require('path').join(process.cwd(), 'data/uploads/videos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Тільки відео або зображення дозволені!'));
  }
});

router.get('/videos', async (req: Request, res: Response) => {
  try {
    const allVideos = await videos.all();
    res.json(allVideos);
  } catch (error) {
    console.error('Помилка завантаження відео:', error);
    res.status(500).json({ error: 'Помилка завантаження відео' });
  }
});

router.get('/videos/:id', async (req: Request, res: Response) => {
  try {
    const video = await videos.get(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Відео не знайдено' });
    }
    res.json(video);
  } catch (error) {
    console.error('Помилка отримання відео:', error);
    res.status(500).json({ error: 'Помилка отримання відео' });
  }
});

router.post('/videos', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (!req.body.title || !req.body.category) {
      return res.status(400).json({ error: 'Обов\'язкові поля: title, category' });
    }

    const category = req.body.category as Video['category'];
    if (!['artistic_work', 'krembivska_embroidery'].includes(category)) {
      return res.status(400).json({ error: 'Невірна категорія' });
    }

    const video: Video = {
      id: crypto.randomUUID(),
      title: req.body.title,
      src: files?.video ? `/uploads/videos/${files.video[0].filename}` : '',
      image: files?.image ? `/uploads/videos/${files.image[0].filename}` : undefined,
      category,
      description: req.body.description || ''
    };

    if (files?.video) {
      const videoPath = files.video[0].path;
      const previewFilename = `${files.video[0].filename}.jpg`;
      const previewFolder = path.join(process.cwd(), 'data/uploads/previews');

      await new Promise ((resolve, reject) => {
        ffmpeg(videoPath)
          .screenshots ({
            timestamps: ['5'],
            filename: previewFilename,
            folder: previewFolder,
            size: '320x240'
          })
          .on ('end', resolve)
          .on ('error', reject);
      });
      video.preview = `/uploads/previews/${previewFilename}`;
    } 

    await videos.create(video);
    res.status(201).json(video);
  } catch (error) {
    console.error('Помилка створення відео:', error);
    res.status(500).json({ error: 'Помилка створення відео' });
  }
});

router.put('/videos/:id', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const existingVideo = await videos.get(req.params.id);

    if (!existingVideo) {
      return res.status(404).json({ error: 'Відео не знайдено' });
    }

    const category = req.body.category as Video['category'];
    if (!['artistic_work', 'krembivska_embroidery'].includes(category)) {
      return res.status(400).json({ error: 'Невірна категорія' });
    }

    const updatedVideo: Video = {
      ...existingVideo,
      title: req.body.title || existingVideo.title,
      src: files?.video ? `/uploads/videos/${files.video[0].filename}` : existingVideo.src,
      image: req.body.removeImage === 'true' ? undefined : 
            files?.image ? `/uploads/videos/${files.image[0].filename}` : 
            existingVideo.image,
      category,
      description: req.body.description || existingVideo.description
    };

    await videos.update(updatedVideo);
    res.json(updatedVideo);
  } catch (error) {
    console.error('Помилка оновлення відео:', error);
    res.status(500).json({ error: 'Помилка оновлення відео' });
  }
});

router.delete('/videos/:id', async (req: Request, res: Response) => {
  try {
    await videos.delete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Помилка видалення відео:', error);
    res.status(500).json({ error: 'Помилка видалення відео' });
  }
});

export default router;