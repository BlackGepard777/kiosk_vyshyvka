import express, { type NextFunction, type Request, type Response } from "express";
import ViteExpress from "vite-express";

// 1. Створення додатку Express
const app = express();

// 2. Додавання проміжного програмного забезпечення (middleware)
app.use(express.json());

async function startServer() {
  try {
    // 3. Запуск сервера ViteExpress всередині блоку try
    ViteExpress.listen(app, 3001, () =>
      console.log("Server is listening on http://localhost:3001/")
    );
  } catch (err) {
    // 4. Обробка помилок
    console.error("Failed to initialize server:", err);
  }
}

// 5. Запуск функції
startServer();