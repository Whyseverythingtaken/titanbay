import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Placeholder for `prisma generate` (e.g. Docker build); runtime uses real DATABASE_URL.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/titanbay',
  },
})
