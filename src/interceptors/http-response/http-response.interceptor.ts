import { Injectable, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

/**
 * 对 http response 做统一返回处理
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const host = context.switchToHttp();
    const res = host.getResponse();
    const req = host.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (res.statusCode === HttpStatus.CREATED && req.method === 'POST') {
          res.statusCode = HttpStatus.OK;
        }
        return {
          code: 1,
          data,
          msg: '操作成功',
        };
      }),
    );
  }
}
