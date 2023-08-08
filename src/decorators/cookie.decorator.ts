import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';

/**
 * 获取 Cookie 中的值,若提供键名，则获取键名对应的值，否则获取 cookie 整个对象
 * @example
 * import { Cookie } from "@/decorators/cookie.decorator";
 * @Get()
 * findAll(@Cookies('name') name: string) {}
 */
export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
