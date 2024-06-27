import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/address.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({ where: { id } });
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
    const user = await this.prismaService.users.update({
      where: { id: address.userId },
      data: {
        address: {
          create: {
            name: address.name,
            phone: address.phone,
            address: address.address,
            default: address.default,
          },
        },
      },
    });
    return user ? user : null;
  }
}
