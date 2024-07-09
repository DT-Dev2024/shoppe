import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { CreateCartDto } from './dto/cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';
import { OrderHistoryRes } from './dto/order-history.dto';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto';
import { OrderStatus } from './dto/order-detail.dto';

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

    if (order) {
      try {
        await this.prismaService.cart.update({
          where: {
            userId: createOrderDto.userId,
          },
          data: {
            cart_items: {
              deleteMany: {},
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    return order ? order : null;
  }

  async findAll() {
    let orderHistories = [];
    try {
      const orders = await this.prismaService.orders.findMany({
        include: {
          order_details: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      orderHistories = orders.map((order) => {
        order.order_details = order.order_details.map((detail: any) => {
          // Assuming product has `price` and `sale_price` attributes
          if (
            detail.product &&
            detail.product.price &&
            detail.product.sale_price
          ) {
            detail.price =
              (detail.product.price -
                (detail.product.sale_price * detail.product.price) / 100) *
              detail.buy_count;
            detail.price_before_discount =
              detail.product.price * detail.buy_count;
            detail.address = order.address;
          } else {
            detail.price_before_discount =
              detail.product.price * detail.buy_count;
          }

          return detail;
        });
        return order;
      });

      // console.log('Order Histories:', orderHistories);
      const combinedOrderDetailsArray = orderHistories.flatMap(
        (order) => order.order_details,
      );
      const combinedOrderDetailsObject = combinedOrderDetailsArray.reduce(
        (acc, detail) => {
          acc[detail.id] = detail;
          return acc;
        },
        {},
      );

      return combinedOrderDetailsObject;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
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

  async updateStatusOrder(prams: UpdateStatusOrderDto) {
    const address_bystatus = {
      WAITING: [
        {
          status: 'WAITING',
          address: 'Đặt hàng thành công',
        },
        {
          status: 'WAITING',
          address: 'Người bán đang chuẩn bị hàng',
        },
      ],
      DELIVERING: [
        {
          status: 'DELIVERING',
          address: 'Đơn vị vận chuyển lấy hàng thành công',
        },
        {
          status: 'DELIVERING',
          address:
            'Đơn hàng rời khỏi bưu cục Xã Tân Phú Trung, Huyện Củ Chi, TP. Hồ Chí Minh',
        },
      ],
      WAIT_RECEIVED: [
        {
          status: 'WAIT_RECEIVED',
          address: 'Đơn hàng rời khỏi kho phân loại',
        },
        {
          status: 'WAIT_RECEIVED',
          address:
            'Đơn hàng đang được vận chuyển và sẽ được giao trong vòng 24 giờ tiếp theo',
        },
      ],
      DELIVERED: [
        {
          status: 'DELIVERED',
          address: 'Đơn hàng đã được giao thành công',
        },
      ],
      CANCELED: [
        {
          status: 'CANCELED',
          address: 'Đơn hàng đã bị huỷ',
        },
      ],
      RETURN: [
        {
          status: 'RETURN',
          address: 'Đơn hàng đang đổi trả',
        },
      ],
    };

    const findListAddressByStatus = [];
    let lastCreateAt = new Date();

    // Hàm để tạo thời gian create_at ngẫu nhiên từ thời gian cuối cùng
    function getRandomCreateAt() {
      const randomHours = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // 2 đến 5 tiếng
      lastCreateAt = new Date(
        lastCreateAt.getTime() + randomHours * 60 * 60 * 1000,
      );
      return lastCreateAt;
    }

    // Hàm để thêm các địa chỉ vào mảng với create_at
    function addAddressesWithCreateAt(
      addresses: { status: string; address: string }[],
    ): void {
      addresses.forEach((addressObj) => {
        findListAddressByStatus.push({
          status: addressObj.status,
          address: addressObj.address,
          created_at: getRandomCreateAt(),
        });
      });
    }

    switch (prams.status) {
      case 'WAITING':
        addAddressesWithCreateAt(address_bystatus.WAITING);
        break;
      case 'DELIVERING':
        addAddressesWithCreateAt([
          // ...address_bystatus.WAITING,
          ...address_bystatus.DELIVERING,
        ]);
        break;
      case 'WAIT_RECEIVED':
        addAddressesWithCreateAt([
          // ...address_bystatus.WAITING,
          ...address_bystatus.DELIVERING,
          ...address_bystatus.WAIT_RECEIVED,
        ]);
        break;
      case 'DELIVERED':
        addAddressesWithCreateAt([
          // ...address_bystatus.WAITING,
          ...address_bystatus.DELIVERING,
          ...address_bystatus.WAIT_RECEIVED,
          ...address_bystatus.DELIVERED,
        ]);
        break;
      case 'CANCELED':
        addAddressesWithCreateAt(address_bystatus.CANCELED); // Chỉ bao gồm mục CANCELED
        break;
      case 'RETURN':
        addAddressesWithCreateAt(address_bystatus.RETURN); // Chỉ bao gồm mục RETURN
        break;
    }

    // delete old address
    if (prams.status === 'CANCELED' || prams.status === 'RETURN') {
      await this.prismaService.order_details.update({
        where: {
          id: prams.id,
        },
        data: {
          list_address_status: {
            deleteMany: {
              status: {
                notIn: ['WAITING'],
              },
            },
          },
        },
      });
    }

    return await this.prismaService.order_details.update({
      where: {
        id: prams.id,
      },
      data: {
        status: prams.status,
        list_address_status: {
          createMany: {
            data: findListAddressByStatus,
          },
        },
      },
    });
  }

  async addToCart(cart: CreateCartDto) {
    const product = await this.prismaService.products.findFirst({
      where: {
        id: cart.cartItems[0].productId,
      },
      // ,
      // include: {
      //   product_types: true,
      // },
    });
    cart.cartItems[0].price =
      product.price - (product.price * product.sale_price) / 100;
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
              // include: {
              //   product_types: true,
              // },
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
    console.log(existingCartItem);
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
    let orderHistories = [];
    try {
      const orders = await this.prismaService.orders.findMany({
        where: {
          userId,
        },
        include: {
          address: true,
          order_details: {
            include: {
              product: true,
              list_address_status: true,
            },
          },
        },
      });

      orderHistories = orders.map((order) => {
        order.order_details = order.order_details.map((detail: any) => {
          // Assuming product has `price` and `sale_price` attributes
          if (
            detail.product &&
            detail.product.price &&
            detail.product.sale_price
          ) {
            detail.price =
              (detail.product.price -
                (detail.product.sale_price * detail.product.price) / 100) *
              detail.buy_count;
            detail.price_before_discount =
              detail.product.price * detail.buy_count;
            detail.address = order.address;
          } else {
            detail.price_before_discount =
              detail.product.price * detail.buy_count;
          }

          return detail;
        });
        return order;
      });

      // console.log('Order Histories:', orderHistories);
      const combinedOrderDetailsArray = orderHistories.flatMap(
        (order) => order.order_details,
      );
      const combinedOrderDetailsObject = combinedOrderDetailsArray.reduce(
        (acc, detail) => {
          acc[detail.id] = detail;
          return acc;
        },
        {},
      );

      return combinedOrderDetailsObject;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }

  async statictics() {
    const total_products = await this.prismaService.products.count();
    const total_customer = await this.prismaService.users.count({
      where: {
        roles: 'USER',
      },
    });
    const total_orders = await this.prismaService.orders.count();
    const orderComp = await this.prismaService.order_details.findMany({
      where: {
        status: OrderStatus.DELIVERED,
      },
    });
    let total_price = 0;
    orderComp.forEach((order) => {
      if (order.status == OrderStatus.DELIVERED) {
        total_price += order.price * order.buy_count;
      }
    });
    return {
      total_products,
      total_customer,
      total_orders,
      total_price,
    };
  }
}
