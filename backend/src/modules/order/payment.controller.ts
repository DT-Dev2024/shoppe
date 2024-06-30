import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/payment.dto';
import { OrderService } from './order.service';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @ApiBearerAuth('token')
  async payment() {
    return ApiResponse.buildApiResponse(
      await this.orderService.getPayment(),
      200,
      'Payment retrieved successfully',
    );
  }

  @Post()
  @ApiBearerAuth('token')
  async paymentMethod(@Body() payment: CreatePaymentDto) {
    return ApiResponse.buildApiResponse(
      await this.orderService.UpdatePayment(payment),
      200,
      'Payment retrieved successfully',
    );
  }
}
