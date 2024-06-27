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

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
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
}
