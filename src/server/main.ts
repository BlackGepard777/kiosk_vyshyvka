import express, { type NextFunction, type Request, type Response } from "express";
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());

async function startServer() {
  try {
    ViteExpress.listen(app, 3001, () =>
      console.log("Server is listening on http://localhost:3001/")
    );
  } catch (err) {
    console.error("Failed to initialize server:", err);
  }
}
startServer();