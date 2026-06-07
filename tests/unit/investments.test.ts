import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../../src/app'

const FUND_ID = '550e8400-e29b-41d4-a716-446655440000'
const INVESTOR_ID = '770e8400-e29b-41d4-a716-446655440002'

const mockPrisma = {
  fund: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  investor: { findMany: vi.fn(), create: vi.fn() },
  investment: { findMany: vi.fn(), create: vi.fn() }
} as any

const app = buildApp(mockPrisma)

beforeEach(() => vi.clearAllMocks())

describe('GET /funds/:fund_id/investments', () => {
  it('returns 200 with investments list', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue({ id: FUND_ID })
    mockPrisma.investment.findMany.mockResolvedValue([
      { id: 'inv-uuid', fund_id: FUND_ID, investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: '2024-01-15' }
    ])

    const res = await app.inject({ method: 'GET', url: `/funds/${FUND_ID}/investments` })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toHaveLength(1)
  })

  it('returns 404 when fund does not exist', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue(null)

    const res = await app.inject({ method: 'GET', url: `/funds/${FUND_ID}/investments` })

    expect(res.statusCode).toBe(404)
  })
})

describe('POST /funds/:fund_id/investments', () => {
  it('returns 201 with the created investment', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue({ id: FUND_ID })
    const created = { id: 'inv-uuid', fund_id: FUND_ID, investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: '2024-01-15' }
    mockPrisma.investment.create.mockResolvedValue(created)

    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: '2024-01-15' }
    })

    expect(res.statusCode).toBe(201)
    expect(JSON.parse(res.body).fund_id).toBe(FUND_ID)
  })

  it('returns 404 when fund does not exist', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue(null)

    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: '2024-01-15' }
    })

    expect(res.statusCode).toBe(404)
  })

  it('returns 400 for invalid investor_id format', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: 'not-a-uuid', amount_usd: 1_000_000, investment_date: '2024-01-15' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for invalid date format', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: 'not-a-date' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for non-positive amount', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: INVESTOR_ID, amount_usd: -100, investment_date: '2024-01-15' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when investor does not exist (FK violation)', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue({ id: FUND_ID })
    const err = Object.assign(new Error('FK violation'), { code: 'P2003' })
    mockPrisma.investment.create.mockRejectedValue(err)

    const res = await app.inject({
      method: 'POST',
      url: `/funds/${FUND_ID}/investments`,
      payload: { investor_id: INVESTOR_ID, amount_usd: 1_000_000, investment_date: '2024-01-15' }
    })

    expect(res.statusCode).toBe(400)
  })
})
