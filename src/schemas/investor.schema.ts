const investorResponseShape = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    investor_type: { type: 'string' },
    email: { type: 'string' },
    created_at: {}
  }
}

export const listInvestorsSchema = {
  response: { 200: { type: 'array', items: investorResponseShape } }
}

export const createInvestorSchema = {
  body: {
    type: 'object',
    required: ['name', 'investor_type', 'email'],
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1 },
      investor_type: { type: 'string', enum: ['Individual', 'Institution', 'Family Office'] },
      email: { type: 'string', format: 'email' }
    }
  }
}
