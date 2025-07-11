import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        let message = 'Request was successful';
        if (statusCode === 401) {
          message = 'Unauthorized access';
        } else if (statusCode === 404) {
          message = 'Resource not found';
        } else if (statusCode === 400) {
          message = 'Bad request';
        }
        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
