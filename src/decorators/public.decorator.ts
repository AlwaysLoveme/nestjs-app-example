import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 设置不需要登录验证的路由，
 * @example
 * @Get('/public')
 * @Public()
 * getPublicList() {}
 *
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
