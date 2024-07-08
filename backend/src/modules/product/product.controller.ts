import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';
import { ApiResponseService } from 'src/shared/providers/api-response/api-response.service';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
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
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryProductDto,
  ) {
    const result = await this.productService.findAll({
      keyword: query.keyword,
    });
    const nameList = result.map((item) => item.name);

    if (!result) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildCollectionApiResponse(
      result,
      200,
      'Products retrieved successfully',
      nameList,
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
