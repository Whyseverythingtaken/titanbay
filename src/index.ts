import { prisma, pool } from './db'
import { buildApp } from './app'
import { config } from './config'

const app = buildApp(prisma)

const start = async () => {
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  }
}

start()
