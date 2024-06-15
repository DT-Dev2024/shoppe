import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { UploadModule } from './upload/upload.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [UsersModule, PrismaModule, ProductModule, UploadModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
