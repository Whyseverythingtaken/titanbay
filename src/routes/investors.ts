import { FastifyInstance } from 'fastify'
import type { InvestorType } from '@prisma/client'
import { listInvestorsSchema, createInvestorSchema } from '../schemas/investor.schema'

export default async function investorRoutes(app: FastifyInstance) {
  const prisma = app.prisma

  app.get('/', { schema: listInvestorsSchema }, async () => {
    return prisma.investor.findMany({ orderBy: { created_at: 'desc' } })
  })

  app.post('/', { schema: createInvestorSchema }, async (req, reply) => {
    const body = req.body as { name: string; investor_type: string; email: string }
    const investor = await prisma.investor.create({
      data: {
        name: body.name,
        investor_type: (body.investor_type === 'Family Office' ? 'FamilyOffice' : body.investor_type) as InvestorType,
        email: body.email
      }
    })
    return reply.code(201).send(investor)
  })
}
