import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import ViteExpress from "vite-express";
import { initDb } from "./db";
import morgan from "morgan";
import login from "./login.ts";
import cookieParser from 'cookie-parser';
import videoRoutes from './admin-api';
import subtitlesRouter from "./subtitles-api.ts"



const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

app.use(express.json());  
app.use(cookieParser()); 

const uploadsPath = process.env.UPLOADS_DIR || path.join(process.cwd(), 'data/uploads');
app.use('/uploads/videos/:filename', (req, res, next) => {
  const ext = path.extname(req.params.filename).toLowerCase();
  if (ext === '.mp4') {
    res.type('video/mp4');
  } else if (ext === '.webm') {
    res.type('video/webm');
  } else if (ext === '.ogg') {
    res.type('video/ogg');
  }
  next();
});

app.use('/uploads', express.static(path.join(process.cwd(), 'data/uploads')));


app.use("/api", login);

app.get("/admin", (req, res, next) => {
  if (req.path === "/admin") res.redirect(301, "/admin/");
  else next();
});

app.use('/api/admin', videoRoutes);

app.use(subtitlesRouter);

async function startServer() {
  try {
    await initDb();
    ViteExpress.listen(app, 3001, () =>
      console.log("Server is listening on http://localhost:3001/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
  }
}
startServer();