import Fastify, { type FastifyInstance } from 'fastify'
import ajvFormats from 'ajv-formats'
import { errorHandler } from './plugins/error-handler'
import fundRoutes from './routes/funds'
import investorRoutes from './routes/investors'
import investmentRoutes from './routes/investments'
import type { ExtendedPrismaClient } from './db'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: ExtendedPrismaClient
  }
}

export function buildApp(prisma: ExtendedPrismaClient): FastifyInstance {
  const app = Fastify({
    logger: true,
    ajv: {
      plugins: [ajvFormats as any]
    }
  })

  app.decorate('prisma', prisma)
  app.setErrorHandler(errorHandler)

  app.register(fundRoutes, { prefix: '/funds' })
  app.register(investorRoutes, { prefix: '/investors' })
  app.register(investmentRoutes, { prefix: '/funds' })

  return app
}
