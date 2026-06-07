const fundBodyProperties = {
  name: { type: 'string', minLength: 1 },
  vintage_year: { type: 'integer', minimum: 1900, maximum: 2100 },
  target_size_usd: { type: 'number', exclusiveMinimum: 0 },
  status: { type: 'string', enum: ['Fundraising', 'Investing', 'Closed'] }
}

const fundResponseShape = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    vintage_year: { type: 'integer' },
    target_size_usd: { type: 'number' },
    status: { type: 'string' },
    created_at: {}
  }
}

export const listFundsSchema = {
  response: { 200: { type: 'array', items: fundResponseShape } }
}

export const getFundSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', format: 'uuid' } }
  }
}

export const createFundSchema = {
  body: {
    type: 'object',
    required: ['name', 'vintage_year', 'target_size_usd', 'status'],
    additionalProperties: false,
    properties: fundBodyProperties
  }
}

export const updateFundSchema = {
  body: {
    type: 'object',
    required: ['id', 'name', 'vintage_year', 'target_size_usd', 'status'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', format: 'uuid' },
      ...fundBodyProperties
    }
  }
}
