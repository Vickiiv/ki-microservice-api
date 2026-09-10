const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Umgebungsvariable ${name} fehlt in der .env!`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  isDevelopment: process.env.NODE_ENV === "development",
  ollamaHost: process.env.OLLAMA_HOST ?? "http://localhost:11434",
};
