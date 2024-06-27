import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum VoncherType {
  SHOP = 'SHOP',
  USER = 'USER',
}

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

class VoncherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsEnum(VoncherType)
  @IsNotEmpty()
  type: VoncherType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty()
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discount_type: DiscountType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  minium_price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxium_discount?: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  expire?: Date;
}

export class CreateOrderDiscountDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VoncherDto)
  voncher: VoncherDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_discount: number;
}
