import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    // const product_type = createProductDto.type;
    // delete createProductDto.type;
    return await this.prismaService.products.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        image: createProductDto.image,
        sale_price: createProductDto.sale_price,
        detailImage: createProductDto.detailImage,
        price : createProductDto.price,
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

  async findAll() {
    const products = await this.prismaService.products.findMany({
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
      include: {  product_feeback: true },
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
        price : updateProductDto.price,
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
