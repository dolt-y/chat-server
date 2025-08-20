/**
 * @file: http-exception.filter.ts
 * @description: 全局异常过滤器
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = exception.getResponse();
    let message: string;
    if (typeof responseBody === 'string') {
      message = responseBody;
    } else {
      message =
        (responseBody as { message?: string }).message ||
        'Internal server error';
    }
    response.status(status).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
