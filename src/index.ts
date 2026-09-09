import express from "express";
import cors from "cors";
import { env } from "./config/env.ts";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.port, () => {
  console.log(`🟢 Server läuft auf Port ${env.port}`);
});
