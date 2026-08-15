import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { ROLES_KEY } from '../decorators/decorators'
import { UserRole } from 'shared'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!required?.length) return true

    const { user } = context.switchToHttp().getRequest<FastifyRequest>()
    if (!user?.role || !required.includes(user.role as UserRole)) {
      throw new ForbiddenException()
    }
    return true
  }
}
