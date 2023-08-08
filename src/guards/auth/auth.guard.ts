import { Reflector } from '@nestjs/core';
import { AuthGuard as PwdAuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Logger } from '@/log/log.service';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';

import type { ExecutionContext } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class JwtAuthGuard extends PwdAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // 记录日志
    const [request, response] = [
      context.switchToHttp().getRequest<FastifyRequest>(),
      context.switchToHttp().getResponse<FastifyReply>(),
    ];
    Logger.logFormat(request, response, response.statusCode);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('登录失效，请重新登录');
    }
    return user;
  }
}
