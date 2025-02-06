import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 捕获所有异常
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(`System Error: ${exception.message}`, {
      stack: exception.stack,
    });

    // 非 HTTP 标准异常的处理。
    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '服务暂时不可用，请稍后重试',
    });
  }
}
