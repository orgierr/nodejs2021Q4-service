import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ReasonPhrases } from 'http-status-codes';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject() private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException | unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          };

    httpAdapter.reply(ctx.getResponse(), responseBody);

    if (exception instanceof HttpException) {
      this.logger.warn({
        method: req.method,
        params: req.params,
        url: req.url,
        query: req.query,
        body: req.body,
        responseCode: res.statusCode,
      });
    } else {
      this.logger.error({
        method: req.method,
        params: req.params,
        url: req.url,
        query: req.query,
        body: req.body,
        responseCode: res.statusCode,
      });
    }
  }
}
