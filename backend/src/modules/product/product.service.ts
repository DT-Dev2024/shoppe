import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }
  async create(createProductDto: CreateProductDto) {
    return await this.prismaService.products.create({ data: createProductDto })
  }

  async findAll() {
    const products = await this.prismaService.products.findMany()
    if (!products) {
      return null
    }
    return products
  }

  async findOne(id: string) {
    return await this.prismaService.products.findUnique({ where: { id } })
  }

  async update(updateProductDto: UpdateProductDto) {
    return await this.prismaService.products.update({ where: { id: updateProductDto.id }, data: updateProductDto })
  }

  async remove(id: string) {
    return await this.prismaService.products.delete({ where: { id } })
  }
}
