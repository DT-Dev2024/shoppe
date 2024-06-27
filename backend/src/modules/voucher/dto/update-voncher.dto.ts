import { PartialType } from '@nestjs/mapped-types';
import { VoucherDto } from './create-voncher.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoucherDto extends PartialType(VoucherDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
