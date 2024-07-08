import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { toNonAccentVietnamese } from 'src/utils/string';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    // const product_type = createProductDto.type;
    // delete createProductDto.type;
    return await this.prismaService.products.create({
      data: {
        name: createProductDto.name,
        keyword: toNonAccentVietnamese(createProductDto.name),
        description: createProductDto.description,
        image: createProductDto.image,
        sale_price: createProductDto.sale_price,
        detailImage: createProductDto.detailImage,
        price: createProductDto.price,
        // product_types: {
        //   createMany: {
        //     data: createProductDto.product_types,
        //   },
        // },
        product_feeback: {
          create: createProductDto.feedback,
        },
      },
    });
  }

  async findAll(params: { keyword: string }) {
    const { keyword } = params;

    const where: Prisma.productsWhereInput = {};
    if (keyword) {
      const _keyword = toNonAccentVietnamese(keyword).toLowerCase();
      where.keyword = {
        contains: _keyword,
      };
    }
    const products = await this.prismaService.products.findMany({
      where,
      include: {
        // product_types: true,
        product_feeback: true,
      },
    });

    if (!products) {
      return null;
    }
    return products;
  }

  async findOne(id: string) {
    return await this.prismaService.products.findUnique({
      where: { id },
      include: { product_feeback: true },
    });
  }

  async update(updateProductDto: UpdateProductDto) {
    return await this.prismaService.products.update({
      where: { id: updateProductDto.id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        image: updateProductDto.image,
        sale_price: updateProductDto.sale_price,
        detailImage: updateProductDto.detailImage,
        price: updateProductDto.price,
        // product_types: {
        //   createMany: {
        //     data: updateProductDto.product_types,
        //   },
        // },
        // product_feeback: {
        //   create: updateProductDto.feedback,
        // },
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.products.delete({ where: { id } });
  }
}
