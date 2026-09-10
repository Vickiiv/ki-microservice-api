import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env.ts";

const summarizeSchema = z.object({
  text: z.string().min(1, "Text darf nicht leer sein."),
});

const ollamaResponseSchema = z.object({
  response: z.string(),
});

export const summarize = async (req: Request, res: Response) => {
  const result = summarizeSchema.safeParse(req.body);
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
      prompt: `Fasse den folgenden Text in maximal 2 Sätzen zusammen. Antworte NUR mit JSON im Format {"summary": "..."}.\n\nText: ${text}`,
      format: "json",
      stream: false,
    }),
  });

  if (!ollamaResponse.ok) {
    return res.status(502).json({
      message: "Ollama ist nicht erreichbar. Läuft der lokale Server?",
    });
  }

  const dataResult = ollamaResponseSchema.safeParse(
    await ollamaResponse.json(),
  );
  if (!dataResult.success) {
    return res.status(502).json({ message: "Unerwartete Antwort von Ollama." });
  }

  try {
    const parsed = JSON.parse(dataResult.data.response);
    res.status(200).json({ summary: parsed.summary });
  } catch {
    res.status(502).json({ message: "Unerwartete Antwort vom Modell." });
  }
};
