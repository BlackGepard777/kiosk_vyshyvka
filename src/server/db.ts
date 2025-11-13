import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";
import fs from "fs";
import type { Video } from "../shared/models";

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

async function initDb() {
  const dbDir = "./data";
  const dbPath = path.join(dbDir, "app.db");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const newDB = !fs.existsSync(dbPath);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  dbInstance = db;

  if (newDB) {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        src TEXT NOT NULL,
        image TEXT,
        preview TEXT,
        category TEXT NOT NULL,
        description TEXT
      )
    `);
  }

  await importVideosFromFolder();

  return db;
}

function getDbInstance(): Database<sqlite3.Database, sqlite3.Statement> {
  if (!dbInstance) {
    throw new Error("База даних не ініціалізована");
  }
  return dbInstance;
}

function getProjectVideos(): Video[] {
  const videoDir = path.join(process.cwd(), "data/uploads/videos");

  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(videoDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return [".mp4", ".mov", ".avi", ".mkv"].includes(ext);
  });

  return files.map(file => {
    const id = path.parse(file).name;
    const video: Video = {
      id,
      title: id,
      src: `/uploads/videos/${file}`, 
      image: undefined, 
      preview: undefined,
      category: "artistic_work", 
      description: ""
    };
    return video;
  });
}

async function importVideosFromFolder() {
  const db = getDbInstance();
  const videosFromFolder = getProjectVideos();

  for (const video of videosFromFolder) {
    const exists = await db.get("SELECT id FROM videos WHERE id = ?", [video.id]);
    if (!exists) {
      await db.run(
        `INSERT INTO videos (id, title, src, image, preview, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [video.id, video.title, video.src, video.image ?? null, video.preview ?? null, video.category, video.description]
      );
      console.log(`✅ Додано в базу: ${video.title}`);
    }
  }
}


const videos = {
  async all(): Promise<Video[]> {
    const db = getDbInstance();
    return await db.all("SELECT * FROM videos ORDER BY id DESC") as Video[];
  },

  async get(id: string): Promise<Video | null> {
    const db = getDbInstance();
    return await db.get("SELECT * FROM videos WHERE id = ?", [id]) as Video | null;
  },

  async create(video: Video): Promise<Video> {
    const db = getDbInstance();
    await db.run(
      `INSERT INTO videos (id, title, src, image, preview, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [video.id, video.title, video.src, video.image ?? null, video.preview ?? null, video.category, video.description]
    );
    return video;
  },

  async update(video: Video): Promise<Video> {
    const db = getDbInstance();
    await db.run(
      `UPDATE videos SET title = ?, src = ?, image = ?, preview = ?, category = ?, description = ? WHERE id = ?`,
      [video.title, video.src, video.image ?? null,video.preview ?? null, video.category, video.description, video.id]
    );
    return video;
  },

  async delete(id: string): Promise<void> {
    const db = getDbInstance();
    await db.run("DELETE FROM videos WHERE id = ?", [id]);
  }
};

export { initDb, videos };