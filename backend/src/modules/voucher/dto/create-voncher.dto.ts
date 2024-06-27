import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum VoucherType {
  SHOP = 'SHOP',
  USER = 'USER',
}

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class VoucherDto {
  @ApiProperty({
    default: VoucherType.USER,
    description:
      'Voucher type is ' + VoucherType.USER + ' or ' + VoucherType.SHOP,
  })
  @IsEnum(VoucherType)
  @IsNotEmpty()
  type: VoucherType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  code: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty({
    default: DiscountType.FIXED,
    description: `Voucher discount type is ${DiscountType.FIXED} or ${DiscountType.PERCENTAGE} `,
  })
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discount_type: DiscountType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  minium_price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  expire?: Date;
}
