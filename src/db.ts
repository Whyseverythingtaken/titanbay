import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from './config'

export const pool = new Pool({ connectionString: config.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    fund: {
      target_size_usd: {
        needs: { target_size_usd: true },
        compute(fund) {
          return Number(fund.target_size_usd)
        }
      }
    },
    investor: {
      investor_type: {
        needs: { investor_type: true },
        compute(investor) {
          return investor.investor_type === 'FamilyOffice'
            ? 'Family Office'
            : (investor.investor_type as string)
        }
      }
    },
    investment: {
      amount_usd: {
        needs: { amount_usd: true },
        compute(inv) {
          return Number(inv.amount_usd)
        }
      },
      investment_date: {
        needs: { investment_date: true },
        compute(inv) {
          return inv.investment_date.toISOString().split('T')[0]
        }
      }
    }
  }
})

export type ExtendedPrismaClient = typeof prisma
