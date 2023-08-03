import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@/prisma/prisma.module';

import { JwtSecretService } from './jwt/jwt.secret';
import { JwtStrategyService } from './jwt/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secretOrKeyProvider: () => JwtSecretService.generateSecretKey(),
        signOptions: {
          expiresIn: '6h',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategyService, JwtSecretService],
  exports: [AuthService],
})
export class AuthModule {}
