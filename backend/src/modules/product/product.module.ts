import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

const providers = [ProductService];
@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [ProductController],
  providers: providers,
})
export class ProductModule { }
