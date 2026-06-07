import 'dotenv/config'

export const config = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development'
}

if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}
