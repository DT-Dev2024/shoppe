import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/providers/api-response/api-response.service';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/decorators/public.decorator';
@ApiTags('product')
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly response: ApiResponseService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({
    summary: 'Tạo sản phẩm mới',
  })
  @ApiBearerAuth('token')
  async create(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);
    const result = await this.productService.create(createProductDto);
    if (!result) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(
      result,
      201,
      'Product created successfully',
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy toàn bộ danh sách sản phẩm',
  })
  // @ApiBearerAuth('token')
  @Public()
  async findAll() {
    const result = await this.productService.findAll();
    if (!result) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildCollectionApiResponse(
      result,
      200,
      'Products retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy sản phẩm theo Id',
  })
  // @ApiBearerAuth('token')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật sản phẩm theo Id',
  })
  @ApiBearerAuth('token')
  async update(@Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá sản phẩm theo id',
  })
  @ApiBearerAuth('token')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
