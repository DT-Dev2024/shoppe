import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';
import { VoucherDto } from './dto/create-voncher.dto';
import { UpdateVoucherDto } from './dto/update-voncher.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('voucher')
@ApiTags('voucher')
export class VoucherController {
  constructor(private readonly voncherService: VoucherService) {}

  @Post()
  @ApiBearerAuth('token')
  async create(@Body() createVoucherDto: VoucherDto) {
    const voucher = await this.voncherService.create(createVoucherDto);
    if (voucher) {
      return ApiResponse.buildApiResponse(voucher, 201, 'Voucher created');
    }
    return ApiResponse.buildApiResponse(null, 400, 'Voucher not created');
  }

  @Get()
  @ApiBearerAuth('token')
  async findAll() {
    const vonchers = await this.voncherService.findAll();
    return ApiResponse.buildCollectionApiResponse(
      vonchers,
      200,
      'Vouchers retrieved successfully',
    );
  }

  @Get(':id')
  @ApiBearerAuth('token')
  async findOne(@Param('id') id: string) {
    const voncher = await this.voncherService.findOne(id);
    if (voncher) {
      return ApiResponse.buildApiResponse(voncher, 200, 'Voucher retrieved');
    }
    return ApiResponse.buildApiResponse(null, 404, 'Voucher not found');
  }

  @Patch()
  @ApiBearerAuth('token')
  async update(@Body() updateVoucherDto: UpdateVoucherDto) {
    const voncher = await this.voncherService.update(updateVoucherDto);
    if (voncher) {
      return ApiResponse.buildApiResponse(voncher, 200, 'Voucher updated');
    }
    return ApiResponse.buildApiResponse(null, 404, 'Voucher not found');
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  remove(@Param('id') id: string) {
    const voncher = this.voncherService.remove(id);
    if (voncher) {
      return ApiResponse.buildApiResponse(voncher, 200, 'Voucher deleted');
    }
    return ApiResponse.buildApiResponse(null, 404, 'Voucher not found');
  }
}
