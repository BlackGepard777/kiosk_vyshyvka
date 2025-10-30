import express, { type NextFunction, type Request, type Response } from "express";
import ViteExpress from "vite-express";
import { initDb } from "./db";
import morgan from "morgan";
import login from "./login.ts";
import cookieParser from 'cookie-parser';


const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

app.use(express.json());  
app.use(cookieParser()); 


app.use("/api", login);

app.get("/admin", (req, res, next) => {
  if (req.path === "/admin") res.redirect(301, "/admin/");
  else next();
});

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