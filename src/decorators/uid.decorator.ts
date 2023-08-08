import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';

/**
 * 获取 request 中的用户 ID，需在登录之后
 */
export const Uid = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  const user: Record<string, unknown> = request['user'] ?? { id: '' };
  return user.id;
});
