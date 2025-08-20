/**
 * @file: response.interceptor.ts
 * @description: 响应拦截器 nest默认响应成功为204
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: T): any => {
        const response: ExpressResponse = context.switchToHttp().getResponse();
        response.status(200);
        return {
          data,
        };
      }),
    );
  }
}
