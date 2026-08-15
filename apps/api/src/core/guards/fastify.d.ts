import type { SessionUser } from './auth.guard'

declare module 'fastify' {
  interface FastifyRequest {
    user?: SessionUser
  }
}
