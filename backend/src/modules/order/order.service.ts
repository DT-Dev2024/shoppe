import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createOrderDto: CreateOrderDto) {
    const order = this.prismaService.orders.create({
      data: {
        userId: createOrderDto.userId,
        address_id: createOrderDto.addressId,
        status: createOrderDto.status,
        total_price: createOrderDto.totalPrice,
        order_details: {
          createMany: {
            data: createOrderDto.orderDetails,
          },
        },
        order_discount: {
          create: createOrderDto.orderDiscount,
        },
      },
    });

    return order ? order : null;
  }

  async findAll() {
    return await this.prismaService.orders.findMany();
  }

  async findOne(id: string) {
    const order = await this.prismaService.orders.findUnique({
      where: {
        id,
      },
      include: {
        order_details: true,
        order_discount: true,
      },
    });
    return order ? order : null;
  }

  update(updateOrderDto: UpdateOrderDto) {
    const updateOrder = this.prismaService.orders.update({
      where: {
        id: updateOrderDto.id,
      },
      data: {
        userId: updateOrderDto.userId,
        address_id: updateOrderDto.addressId,
        status: updateOrderDto.status,
        total_price: updateOrderDto.totalPrice,
        order_details: {
          createMany: {
            data: updateOrderDto.orderDetails,
          },
        },
        order_discount: {
          create: updateOrderDto.orderDiscount,
        },
      },
    });

    return updateOrder ? updateOrder : null;
  }

  async remove(id: string) {
    const order = await this.prismaService.orders.delete({
      where: {
        id,
      },
    });

    return order ? order : null;
  }
}
