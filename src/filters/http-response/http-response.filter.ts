import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch()
export class HttpResponseFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let status = 500;
    let message = '';
    // 优先获取通过  new HttpException() 抛出的错误信息
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (response) {
        const messageList = response['message'];
        message =
          Array.isArray(messageList) && messageList.length > 0
            ? messageList[0]
            : exception.message;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // 获取通过 new Error() 抛出的错误信息
      message = exception.message;
    }

    response.status(status).send({
      code: 0,
      msg: message,
    });
  }
}
