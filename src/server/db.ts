import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path"
import fs from "fs";


let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null; 

async function initDb() {
  const dbDir = "./data";
  const dbPath = path.join(dbDir, "app.db");

  
  if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
  }

  const newDB = !fs.existsSync(dbPath);
  
  const db = await open ({
      filename: dbPath,
      driver: sqlite3.Database,
  });

  dbInstance = db;

  if (newDB) {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS videos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subtitle TEXT,
            category TEXT NOT NULL,
            subcategory TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
  }
  return db;
}

function getDbInstance(): Database<sqlite3.Database, sqlite3.Statement>{
    if (!dbInstance) {
        throw new Error("База даних не ініціалізована");
    }
    return dbInstance;
}

export {initDb};