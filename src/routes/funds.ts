import { FastifyInstance } from 'fastify'
import { listFundsSchema, getFundSchema, createFundSchema, updateFundSchema } from '../schemas/fund.schema'

export default async function fundRoutes(app: FastifyInstance) {
  const prisma = app.prisma

  app.get('/', { schema: listFundsSchema }, async () => {
    return prisma.fund.findMany({ orderBy: { created_at: 'desc' } })
  })

  app.get('/:id', { schema: getFundSchema }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const fund = await prisma.fund.findUnique({ where: { id } })
    if (!fund) return reply.code(404).send({ message: 'Fund not found' })
    return fund
  })

  app.post('/', { schema: createFundSchema }, async (req, reply) => {
    const fund = await prisma.fund.create({ data: req.body as any })
    return reply.code(201).send(fund)
  })

  app.put('/', { schema: updateFundSchema }, async (req, reply) => {
    const { id, ...data } = req.body as { id: string; [key: string]: unknown }
    const fund = await prisma.fund.update({ where: { id }, data: data as any })
    return reply.send(fund)
  })
}
