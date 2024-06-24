import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (request) {
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        code: status,
        error: exception?.constructor?.name,
        message:
          typeof exception.getResponse() === 'object'
            ? (exception.getResponse() as any).message
            : exception.getResponse(),
        stack:
          process.env.APP_ENV !== 'production' ? exception.stack : undefined,
      };
      this.logger.error(JSON.stringify(errorResponse));
      return response.status(status).json(errorResponse);
    } else {
      // GRAPHQL Exception
      // const gqlHost = GqlArgumentsHost.create(host);
      return exception;
    }
  }
}
