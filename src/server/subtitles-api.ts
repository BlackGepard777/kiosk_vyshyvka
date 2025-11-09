import { Router, type Request, type Response } from 'express';
import path from 'path';


const router = Router();

router.get('/api/subtitles/config', (req, res) => {
  const configPath = path.join(__dirname, '../../data/subtitles/config.json');
  res.sendFile(configPath);
});

router.get('/api/subtitles/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../data/subtitles', req.params.filename);
  res.sendFile(filePath);
});

export default router;