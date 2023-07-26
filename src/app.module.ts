import { Module } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@/pipes/validation/validation.pipe';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
