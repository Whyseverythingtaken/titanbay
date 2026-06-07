import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../../src/app'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

const mockPrisma = {
  fund: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  investor: { findMany: vi.fn(), create: vi.fn() },
  investment: { findMany: vi.fn(), create: vi.fn() }
} as any

const app = buildApp(mockPrisma)

beforeEach(() => vi.clearAllMocks())

describe('GET /funds', () => {
  it('returns 200 with a list of funds', async () => {
    const funds = [{ id: VALID_UUID, name: 'Fund A', vintage_year: 2023, target_size_usd: 1_000_000, status: 'Fundraising', created_at: new Date() }]
    mockPrisma.fund.findMany.mockResolvedValue(funds)

    const res = await app.inject({ method: 'GET', url: '/funds' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toHaveLength(1)
    expect(JSON.parse(res.body)[0].name).toBe('Fund A')
  })
})

describe('GET /funds/:id', () => {
  it('returns 200 when fund exists', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue({ id: VALID_UUID, name: 'Fund A', vintage_year: 2023, target_size_usd: 1_000_000, status: 'Fundraising', created_at: new Date() })

    const res = await app.inject({ method: 'GET', url: `/funds/${VALID_UUID}` })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).id).toBe(VALID_UUID)
  })

  it('returns 404 when fund does not exist', async () => {
    mockPrisma.fund.findUnique.mockResolvedValue(null)

    const res = await app.inject({ method: 'GET', url: `/funds/${VALID_UUID}` })

    expect(res.statusCode).toBe(404)
  })
})

describe('POST /funds', () => {
  it('returns 201 with the created fund', async () => {
    const created = { id: VALID_UUID, name: 'New Fund', vintage_year: 2024, target_size_usd: 500_000_000, status: 'Fundraising', created_at: new Date() }
    mockPrisma.fund.create.mockResolvedValue(created)

    const res = await app.inject({
      method: 'POST',
      url: '/funds',
      payload: { name: 'New Fund', vintage_year: 2024, target_size_usd: 500_000_000, status: 'Fundraising' }
    })

    expect(res.statusCode).toBe(201)
    expect(JSON.parse(res.body).name).toBe('New Fund')
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/funds',
      payload: { name: 'Incomplete' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for invalid status value', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/funds',
      payload: { name: 'Fund', vintage_year: 2024, target_size_usd: 1_000_000, status: 'Unknown' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for non-positive target_size_usd', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/funds',
      payload: { name: 'Fund', vintage_year: 2024, target_size_usd: 0, status: 'Fundraising' }
    })

    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /funds', () => {
  it('returns 200 with the updated fund', async () => {
    const updated = { id: VALID_UUID, name: 'Updated Fund', vintage_year: 2024, target_size_usd: 300_000_000, status: 'Investing', created_at: new Date() }
    mockPrisma.fund.update.mockResolvedValue(updated)

    const res = await app.inject({
      method: 'PUT',
      url: '/funds',
      payload: { id: VALID_UUID, name: 'Updated Fund', vintage_year: 2024, target_size_usd: 300_000_000, status: 'Investing' }
    })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).status).toBe('Investing')
  })

  it('returns 404 when fund does not exist', async () => {
    const err = Object.assign(new Error('not found'), { code: 'P2025' })
    mockPrisma.fund.update.mockRejectedValue(err)

    const res = await app.inject({
      method: 'PUT',
      url: '/funds',
      payload: { id: VALID_UUID, name: 'Fund', vintage_year: 2024, target_size_usd: 1_000_000, status: 'Fundraising' }
    })

    expect(res.statusCode).toBe(404)
  })

  it('returns 400 when id is missing from body', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/funds',
      payload: { name: 'Fund', vintage_year: 2024, target_size_usd: 1_000_000, status: 'Fundraising' }
    })

    expect(res.statusCode).toBe(400)
  })
})
