import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';
export function logHttpConsole() {
  const httpLogger = new Logger('Http');
  return morgan('combined', {
    stream: {
      write: (message: string) => {
        httpLogger.log(message);
      },
    },
  });
}
