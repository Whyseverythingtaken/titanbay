import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

export function errorHandler(
  error: FastifyError & { code?: string },
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error.validation) {
    return reply.code(400).send({ message: 'Validation error', errors: error.validation })
  }

  if (error.code === 'P2002') {
    return reply.code(409).send({ message: 'A record with this value already exists' })
  }

  if (error.code === 'P2025') {
    return reply.code(404).send({ message: 'Record not found' })
  }

  if (error.code === 'P2003') {
    return reply.code(400).send({ message: 'Referenced record does not exist' })
  }

  if (error.statusCode) {
    return reply.code(error.statusCode).send({ message: error.message })
  }

  request.log.error(error)
  return reply.code(500).send({ message: 'Internal server error' })
}
