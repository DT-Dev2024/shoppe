import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';
import { CreatePaymentDto } from './dto/payment.dto';
import { CreateCartDto } from './dto/cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiBearerAuth('token')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    if (!order) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(
      order,
      201,
      'Order created successfully',
    );
  }

  @Get()
  @ApiBearerAuth('token')
  async findAll() {
    return ApiResponse.buildCollectionApiResponse(
      await this.orderService.findAll(),
      200,
      'Orders retrieved successfully',
    );
  }

  @Get(':id')
  @ApiBearerAuth('token')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    if (!order) {
      return ApiResponse.buildApiResponse(null, 404, 'Order not found');
    }
    return ApiResponse.buildApiResponse(
      order,
      200,
      'Order retrieved successfully',
    );
  }

  @Patch()
  @ApiBearerAuth('token')
  update(@Body() updateOrderDto: UpdateOrderDto) {
    const updateOrder = this.orderService.update(updateOrderDto);
    if (!updateOrder) {
      return ApiResponse.buildApiResponse(null, 404, 'Order not found');
    }
    return ApiResponse.buildApiResponse(
      updateOrder,
      200,
      'Order updated successfully',
    );
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  remove(@Param('id') id: string) {
    const order = this.orderService.remove(id);
    if (!order) {
      return ApiResponse.buildApiResponse(null, 404, 'Order not found');
    }
    return ApiResponse.buildApiResponse(
      order,
      200,
      'Order deleted successfully',
    );
  }

  @Get('payment')
  @ApiBearerAuth('token')
  async payment() {
    return ApiResponse.buildApiResponse(
      await this.orderService.getPayment(),
      200,
      'Orders retrieved successfully',
    );
  }

  @Post('payment')
  @ApiBearerAuth('token')
  async paymentMethod(@Body() payment: CreatePaymentDto) {
    return ApiResponse.buildApiResponse(
      await this.orderService.UpdatePayment(payment),
      200,
      'Orders retrieved successfully',
    );
  }

  @Post('add-to-cart')
  @ApiBearerAuth('token')
  async addToCart(@Body() cart: CreateCartDto) {
    const result = await this.orderService.addToCart(cart);
    if (result) {
      return ApiResponse.buildApiResponse(
        result,
        200,
        'Cart created successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }

  @Post('update-cart')
  @ApiBearerAuth('token')
  async updateCart(@Body() cart: UpdateCartDto) {
    const result = await this.orderService.updateCart(cart);
    if (result) {
      return ApiResponse.buildApiResponse(
        result,
        200,
        'Cart created successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }

  @Get('cart/:userId')
  @ApiBearerAuth('token')
  async getCart(@Param('userId') userId: string) {
    return ApiResponse.buildApiResponse(
      await this.orderService.getCart(userId),
      200,
      'Cart retrieved successfully',
    );
  }

  @Delete('cart')
  @ApiBearerAuth('token')
  async deleteCart(deleteCart: DeleteCartDto) {
    return ApiResponse.buildApiResponse(
      await this.orderService.deleteCart(deleteCart),
      200,
      'Cart deleted successfully',
    );
  }

  @Get('order-history/:userId')
  @ApiBearerAuth('token')
  async getOrdersHistory(@Param('userId') userId: string) {
    return ApiResponse.buildApiResponse(
      await this.orderService.getOrdersHistory(userId),
      200,
      'Cart retrieved successfully',
    );
  }
}
