import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';
import { VoucherDto } from 'src/modules/voucher/dto/create-voncher.dto';

export class CreateOrderDiscountDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VoucherDto)
  voncher: VoucherDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_discount: number;
}
