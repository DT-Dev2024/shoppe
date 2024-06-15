import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [MulterModule.registerAsync({
    useFactory: () => ({
      dest: './uploads',
    }),
  }),
    SharedModule

  ],
  controllers: [UploadController]
})
export class UploadModule { }
