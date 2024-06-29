import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/address.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.users.findMany({
      include: {
        address: true,
        orders: {
          include: { order_details: true, order_discount: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      include: {
        address: true,
        orders: {
          include: { order_details: true, order_discount: true },
        },
      },
    });
    return user ? user : null;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.users.update({
      where: { id: updateUserDto.id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    });
    return user ? user : null;
  }

  async remove(id: string) {
    const user = await this.prismaService.users.delete({ where: { id } });
    return user ? user : null;
  }

  async updateAddress(address: CreateAddressDto) {
    // If the address has an ID, it's an update operation
    if (address.id !== '') {
      console.log('update');
      // If the address should be the default, unset all other default addresses for the user
      if (address.default) {
        await this.prismaService.$transaction(async (prisma) => {
          await prisma.addresses.updateMany({
            where: { usersId: address.userId },
            data: { default: false },
          });
        });
      }

      // Update the address
      return await this.prismaService.addresses.update({
        where: { id: address.id },
        data: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          default: address.default,
        },
      });
    }
    console.log(address);

    await this.prismaService.addresses.create({
      data: {
        name: address.name,
        phone: address.phone,
        address: address.address,
        default: address.default,
        usersId: address.userId,
      },
    });
    // Return the user with updated addresses
    return await this.prismaService.users.findUnique({
      where: { id: address.userId },
      include: { address: true },
    });
  }

  async updateAddress2(addressId: string) {
    const update = await this.prismaService.addresses.update({
      where: { id: addressId },
      data: {
        default: true,
      },
    });

    await this.prismaService.addresses.updateMany({
      where: { usersId: update.usersId, id: { not: update.id } },
      data: { default: false },
    });

    return update ? update : null;
  }
}
