import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../../src/app'

const mockPrisma = {
  fund: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  investor: { findMany: vi.fn(), create: vi.fn() },
  investment: { findMany: vi.fn(), create: vi.fn() }
} as any

const app = buildApp(mockPrisma)

beforeEach(() => vi.clearAllMocks())

describe('GET /investors', () => {
  it('returns 200 with a list of investors', async () => {
    mockPrisma.investor.findMany.mockResolvedValue([
      { id: 'uuid1', name: 'Alice', investor_type: 'Institution', email: 'alice@test.com', created_at: new Date() }
    ])

    const res = await app.inject({ method: 'GET', url: '/investors' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toHaveLength(1)
  })
})

describe('POST /investors', () => {
  it('returns 201 with the created investor', async () => {
    const created = { id: 'uuid1', name: 'Bob', investor_type: 'Individual', email: 'bob@test.com', created_at: new Date() }
    mockPrisma.investor.create.mockResolvedValue(created)

    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Bob', investor_type: 'Individual', email: 'bob@test.com' }
    })

    expect(res.statusCode).toBe(201)
    expect(JSON.parse(res.body).name).toBe('Bob')
  })

  it('accepts "Family Office" as investor_type', async () => {
    const created = { id: 'uuid2', name: 'Chen Trust', investor_type: 'Family Office', email: 'trust@chen.com', created_at: new Date() }
    mockPrisma.investor.create.mockResolvedValue(created)

    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Chen Trust', investor_type: 'Family Office', email: 'trust@chen.com' }
    })

    expect(res.statusCode).toBe(201)
  })

  it('returns 400 for invalid investor_type', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Bob', investor_type: 'Hedge Fund', email: 'bob@test.com' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Bob', investor_type: 'Individual', email: 'not-an-email' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Bob' }
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 409 for duplicate email', async () => {
    const err = Object.assign(new Error('unique constraint'), { code: 'P2002' })
    mockPrisma.investor.create.mockRejectedValue(err)

    const res = await app.inject({
      method: 'POST',
      url: '/investors',
      payload: { name: 'Bob', investor_type: 'Individual', email: 'exists@test.com' }
    })

    expect(res.statusCode).toBe(409)
  })
})
