import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtSecretService } from './jwt.secret';
import { PrismaService } from '@/prisma/prisma.service';

import type { JwtPayload } from '../IAuth';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: new JwtSecretService().getSecret(),
      algorithms: ['HS256'], // 指定使用 HS256 算法
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.uid,
      },
    });

    if (!user) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }

    return user;
  }
}
