import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { CreateCartDto } from './dto/cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prismaService.orders.create({
      data: {
        userId: createOrderDto.userId,
        address_id: createOrderDto.addressId,
        total_price: createOrderDto.totalPrice,
        payment_method: createOrderDto.paymentMethod,
        order_details: {
          createMany: {
            data: createOrderDto.orderDetails,
          },
        },
      },
    });

    return order ? order : null;
  }

  async findAll() {
    return await this.prismaService.orders.findMany({
      include: {
        order_details: true,
        order_discount: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prismaService.orders.findUnique({
      where: {
        id,
      },
      include: {
        order_details: true,
        order_discount: true,
        user: true,
      },
    });
    return order ? order : null;
  }

  async update(updateOrderDto: UpdateOrderDto) {
    const updateOrder = await this.prismaService.orders.update({
      where: {
        id: updateOrderDto.id,
      },
      data: {
        userId: updateOrderDto.userId,
        address_id: updateOrderDto.addressId,
        total_price: updateOrderDto.totalPrice,
        payment_method: updateOrderDto.paymentMethod,
        order_details: {
          createMany: {
            data: updateOrderDto.orderDetails,
          },
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

  async getPayment() {
    return await this.prismaService.payments.findMany({});
  }

  async UpdatePayment(payment: CreatePaymentDto) {
    const paymentFind = await this.prismaService.payments.findFirst({});
    if (!paymentFind) {
      return await this.prismaService.payments.create({
        data: {
          MOMO: payment.MOMO,
          BANK: payment.BANK,
          PAY_OFFLINE: payment.PAY_OFFLINE,
          status: payment.status,
        },
      });
    } else {
      return await this.prismaService.payments.update({
        where: { id: paymentFind.id },
        data: {
          MOMO: payment.MOMO,
          BANK: payment.BANK,
          PAY_OFFLINE: payment.PAY_OFFLINE,
          status: payment.status,
        },
      });
    }
  }

  async addToCart(cart: CreateCartDto) {
    const product = await this.prismaService.products.findFirst({
      where: {
        id: cart.cartItems[0].productId,
      },
      include: {
        product_types: true,
      },
    });
    cart.cartItems[0].price = product.product_types[0].price -
      product.product_types[0].price * (product.sale_price / 100);
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const findCart = await prisma.cart.findFirst({
          where: {
            userId: cart.userId,
          },
        });

        if (!findCart) {
          return prisma.cart.create({
            data: {
              userId: cart.userId,
              cart_items: {
                createMany: {
                  data: cart.cartItems,
                },
              },
            },
          });
        } else {
          return prisma.cart.update({
            where: {
              id: findCart.id,
            },
            data: {
              cart_items: {
                createMany: {
                  data: cart.cartItems,
                },
              },
            },
          });
        }
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  async getCart(userId: string) {
    return await this.prismaService.cart.findFirst({
      where: {
        userId,
      },
      include: {
        cart_items: {
          include: {
            product: {
              include: {
                product_types: true,
              },
            },
          },
        },
      },
    });
  }

  async updateCart(updateCart: UpdateCartDto) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId: updateCart.userId },
      include: { cart_items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingCartItem = cart.cart_items.find(
      (item) => item.productId === updateCart.cartItem.productId,
    );

    if (!existingCartItem) {
      return await this.prismaService.cart_item.create({
        data: {
          cartId: cart.id,
          productId: updateCart.cartItem.productId,
          buy_count: updateCart.cartItem.buy_count,
        },
      });
    }

    await this.prismaService.cart_item.update({
      where: { id: existingCartItem.id },
      data: {
        productId: updateCart.cartItem.productId,
        buy_count: updateCart.cartItem.buy_count,
      },
    });

    await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { updated_at: new Date() },
    });

    return existingCartItem;
  }

  async deleteCart(deleteCart: DeleteCartDto) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId: deleteCart.userId },
      include: { cart_items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const deletedCartItems = await this.prismaService.cart_item.deleteMany({
      where: {
        cartId: cart.id,
        productId: {
          in: deleteCart.productIds,
        },
      },
    });

    return deletedCartItems;
  }

  async getOrdersHistory(userId: string) {
    return await this.prismaService.orders.findMany({
      where: {
        userId,
      },
    });
  }
}
