import { Injectable } from '@nestjs/common';
import { UpdateVoucherDto } from './dto/update-voncher.dto';
import { VoucherDto } from './dto/create-voncher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoucherService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createVoncherDto: VoucherDto) {
    const voncher = await this.prismaService.vouchers.create({
      data: {
        code: createVoncherDto.code,
        discount: createVoncherDto.discount,
        type: createVoncherDto.type,
        minium_price: createVoncherDto.minium_price,
        expire: createVoncherDto.expire,
        discount_type: createVoncherDto.discount_type,
      },
    });

    return voncher ? voncher : null;
  }

  async findAll() {
    const voncher = await this.prismaService.vouchers.findMany();
    return voncher ? voncher : null;
  }

  async findOne(id: string) {
    const voncher = await this.prismaService.vouchers.findUnique({
      where: {
        id,
      },
    });
    return voncher ? voncher : null;
  }

  async update(updateVoncherDto: UpdateVoucherDto) {
    const voncher = await this.prismaService.vouchers.update({
      where: {
        id: updateVoncherDto.id,
      },
      data: {
        code: updateVoncherDto.code,
        discount: updateVoncherDto.discount,
        type: updateVoncherDto.type,
        minium_price: updateVoncherDto.minium_price,
        expire: updateVoncherDto.expire,
        discount_type: updateVoncherDto.discount_type,
      },
    });
    return voncher ? voncher : null;
  }

  async remove(id: string) {
    const voncher = await this.prismaService.vouchers.delete({
      where: {
        id,
      },
    });
    return voncher ? voncher : null;
  }
}
