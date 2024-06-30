import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [OrderController, PaymentController],
  providers: [OrderService],
  imports: [PrismaModule],
})
export class OrderModule {}
