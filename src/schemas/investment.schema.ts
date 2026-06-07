const investmentResponseShape = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    investor_id: { type: 'string' },
    fund_id: { type: 'string' },
    amount_usd: { type: 'number' },
    investment_date: { type: 'string' }
  }
}

const notFoundResponse = {
  type: 'object',
  properties: { message: { type: 'string' } }
}

export const listInvestmentsSchema = {
  params: {
    type: 'object',
    required: ['fund_id'],
    properties: { fund_id: { type: 'string', format: 'uuid' } }
  },
  response: {
    200: { type: 'array', items: investmentResponseShape },
    404: notFoundResponse
  }
}

export const createInvestmentSchema = {
  params: {
    type: 'object',
    required: ['fund_id'],
    properties: { fund_id: { type: 'string', format: 'uuid' } }
  },
  response: { 404: notFoundResponse, 422: notFoundResponse, 201: investmentResponseShape },
  body: {
    type: 'object',
    required: ['investor_id', 'amount_usd', 'investment_date'],
    additionalProperties: false,
    properties: {
      investor_id: { type: 'string', format: 'uuid' },
      amount_usd: { type: 'number', exclusiveMinimum: 0 },
      investment_date: { type: 'string', format: 'date' }
    }
  }
}
