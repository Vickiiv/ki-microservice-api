import express from "express";
import cors from "cors";
import { env } from "./config/env.ts";
import summarizeRoutes from "./routes/summarize.routes.ts";
import tagsRoutes from "./routes/tags.routes.ts";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/summarize", summarizeRoutes);
app.use("/suggest-tags", tagsRoutes);

app.listen(env.port, () => {
  console.log(`🟢 Server läuft auf Port ${env.port}`);
});
