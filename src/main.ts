import * as IP from 'ip';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyCsrf from '@fastify/csrf-protection';
import secureSession from '@fastify/secure-session';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter({
      logger: false,
    }),
    {
      rawBody: true,
      bodyParser: false,
      logger: ['error', 'warn'],
    },
  );

  await app.register(fastifyCsrf);
  // 允许通过 multipart/form-data 传输数据
  await app.register(fastifyMultipart, { attachFieldsToBody: 'keyValues' });
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
  });
  await app.register(secureSession, {
    secret: process.env.SESSION_SECRET,
    salt: process.env.SESSION_SALT,
  });

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    // 所有路由 对dto 入参进行验证 https://docs.nestjs.com/techniques/validation
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TestAPI')
    .setDescription('The Test API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // CSP策略
  await app.register(helmet, {
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `https: 'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  await app.listen(3000, IP.address('public'));
  console.log(`Application running on url: ${await app.getUrl()}`);
}
bootstrap();
