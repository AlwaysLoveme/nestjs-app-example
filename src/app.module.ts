import { Module } from '@nestjs/common';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth/auth.guard';
import { HttpResponseFilter } from '@/filters/http-response/http-response.filter';
import { HttpResponseInterceptor } from '@/interceptors/http-response/http-response.interceptor';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { ThrottlerModule } from '@nestjs/throttler';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`../.env.${process.env.NODE_ENV}`, '.env.local'],
      isGlobal: true,
    }),
    // 限制同一 IP 地址请求速率
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpResponseFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApplicationModule {}
