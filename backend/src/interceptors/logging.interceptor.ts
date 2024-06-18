import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { pick } from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { calculateLatency } from 'src/shared/utils';
import { Logger } from 'winston';
import { requestByContext } from 'src/shared/utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = this.logger;
    const prefix = `${context.getClass().name}:${context.getHandler().name}`;
    const request = context.switchToHttp().getRequest();
    const correlationId =
      requestByContext.getFromContextRequest('correlationId');
    const start = new Date();

    logger.http(
      JSON.stringify({
        prefix,
        correlationId,
        ...pick(request, ['method', 'url', 'body', 'headers', 'query']),
      }),
    );

    return next.handle().pipe(
      tap({
        next(response) {
          const end = new Date();
          const latency = `${calculateLatency(start, end)} ms`;
          logger.http(
            JSON.stringify({
              prefix,
              correlationId,
              start,
              end,
              latency,
              ...pick(request, ['method', 'url']),
              response,
            }),
          );
        },
        error(error) {
          const end = new Date();
          const latency = `${calculateLatency(start, end)} ms`;
          logger.http(
            JSON.stringify({
              prefix,
              correlationId,
              start,
              end,
              latency,
              ...pick(request, ['method', 'url']),
              error,
            }),
          );
        },
      }),
    );
  }
}
