import { z } from "zod";

const envSchema = z.object({
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  VITE_APP_URL: z.string().url().optional().default("http://localhost:5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

export const env = envSchema.parse({
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  NODE_ENV: import.meta.env.MODE,
});