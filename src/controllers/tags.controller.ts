import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env.ts";

const tagsSchema = z.object({
  text: z.string().min(1, "Text darf nicht leer sein."),
});

const ollamaResponseSchema = z.object({
  response: z.string(),
});

const tagsResultSchema = z.object({
  tags: z.array(z.string()),
});

export const suggestTags = async (req: Request, res: Response) => {
  const result = tagsSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ errors: z.flattenError(result.error).fieldErrors });
  }

  const { text } = result.data;

  const ollamaResponse = await fetch(`${env.ollamaHost}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `Schlage 3 bis 5 passende Schlagwörter (Tags) für den folgenden Text vor. Antworte NUR mit JSON im Format {"tags": ["tag1", "tag2", ...]}.\n\nText: ${text}`,
      format: "json",
      stream: false,
      keep_alive: "30m",
    }),
  });

  if (!ollamaResponse.ok) {
    return res
      .status(502)
      .json({
        message: "Ollama ist nicht erreichbar. Läuft der lokale Server?",
      });
  }

  const dataResult = ollamaResponseSchema.safeParse(
    await ollamaResponse.json(),
  );
  if (!dataResult.success) {
    return res.status(502).json({ message: "Unerwartete Antwort von Ollama." });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(dataResult.data.response);
  } catch {
    return res.status(502).json({ message: "Unerwartete Antwort vom Modell." });
  }

  const tagsResult = tagsResultSchema.safeParse(parsed);
  if (!tagsResult.success) {
    return res
      .status(502)
      .json({ message: "Modell hat kein gültiges Tag-Format geliefert." });
  }

  res.status(200).json({ tags: tagsResult.data.tags });
};
