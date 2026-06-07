import { FastifyInstance } from 'fastify'
import { listInvestmentsSchema, createInvestmentSchema } from '../schemas/investment.schema'

export default async function investmentRoutes(app: FastifyInstance) {
  const prisma = app.prisma

  app.get('/:fund_id/investments', { schema: listInvestmentsSchema }, async (req, reply) => {
    const { fund_id } = req.params as { fund_id: string }
    const fund = await prisma.fund.findUnique({ where: { id: fund_id } })
    if (!fund) return reply.code(404).send({ message: 'Fund not found' })
    return prisma.investment.findMany({ where: { fund_id }, orderBy: { investment_date: 'desc' } })
  })

  app.post('/:fund_id/investments', { schema: createInvestmentSchema }, async (req, reply) => {
    const { fund_id } = req.params as { fund_id: string }
    const body = req.body as { investor_id: string; amount_usd: number; investment_date: string }

    const fund = await prisma.fund.findUnique({ where: { id: fund_id } })
    if (!fund) return reply.code(404).send({ message: 'Fund not found' })

    const investment = await prisma.investment.create({
      data: {
        fund_id,
        investor_id: body.investor_id,
        amount_usd: body.amount_usd,
        investment_date: new Date(body.investment_date)
      }
    })
    return reply.code(201).send(investment)
  })
}
