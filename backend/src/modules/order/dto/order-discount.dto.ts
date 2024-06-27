import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDiscountDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  voncher: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_discount: number;
}
