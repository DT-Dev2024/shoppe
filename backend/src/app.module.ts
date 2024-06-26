import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { UploadModule } from './upload/upload.module';
import { SharedModule } from './shared/shared.module';
import { UiModule } from './modules/ui/ui.module';
import { WinstonModule as LoggerModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { TransformableInfo } from 'logform';
import 'winston-daily-rotate-file';
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const format = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          winston.format.printf(
            (info: TransformableInfo) =>
              `[${info.timestamp}][${info.level}]: ${info.message}`,
          ),
        );
        const transports = [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize({ all: true }),
            ),
          }) as winston.transport,
        ];
        if (configService.get('LOG_FILE_ENABLE')) {
          transports.push(
            new winston.transports.DailyRotateFile({
              dirname: 'logs',
              datePattern: 'YYYY-MM-DD',
              filename: '%DATE%.log',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
            }) as winston.transport,
          );
          transports.push(
            new winston.transports.DailyRotateFile({
              dirname: 'logs/http',
              datePattern: 'YYYY-MM-DD',
              filename: 'http %DATE%.log',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
              level: 'http',
            }) as winston.transport,
          );
        }
        return {
          format,
          transports,
        };
      },
    }),
    UsersModule,
    PrismaModule,
    ProductModule,
    UploadModule,
    SharedModule,
    UiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
