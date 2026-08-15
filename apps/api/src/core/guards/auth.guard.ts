import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { fromNodeHeaders } from 'better-auth/node'
import { FastifyRequest } from 'fastify'
import { auth } from '../../config/auth'
import { IS_PUBLIC_KEY } from '../decorators/decorators'

export type SessionUser = (typeof auth.$Infer.Session)['user']

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })
    if (!session) throw new UnauthorizedException()

    request.user = session.user
    return true
  }
}
