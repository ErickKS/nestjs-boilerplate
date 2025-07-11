import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
