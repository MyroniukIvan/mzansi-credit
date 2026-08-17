import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import type { UserRole } from 'shared'
import type { SessionUser } from '../guards/auth.guard'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'

export const IS_PUBLIC_KEY = 'isPublic'
export const ROLES_KEY = 'roles'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SessionUser => {
    const { user } = context.switchToHttp().getRequest<FastifyRequest>()
    if (!user) throw new UnauthorizedException()
    return user
  }
)
