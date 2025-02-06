import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { BusinessException } from './business.exception';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 处理业务异常
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      this.logger.warn(`Business Exception: ${JSON.stringify(error)}`);
      response.status(HttpStatus.OK).json({
        data: null,
        status: error['code'],
        message: error['message'],
        success: false,
      });
      return;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse()['message'],
    };

    this.logger.error(`Http Exception: ${JSON.stringify(errorResponse)}`);
    response.status(status).json(errorResponse);
  }
}
