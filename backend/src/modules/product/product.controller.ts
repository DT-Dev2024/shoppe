import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/providers/api-response/api-response.service';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private readonly response: ApiResponseService
  ) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(createProductDto);
    if (!result) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(result, 201, 'Product created successfully');
  }

  @Get()
  async findAll() {
    const result = await this.productService.findAll();
    if (!result) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildCollectionApiResponse(result, 200, 'Products retrieved successfully');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
