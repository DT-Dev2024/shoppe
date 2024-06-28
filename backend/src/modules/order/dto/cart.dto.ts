import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOrderDetailsDto } from './order-detail.dto';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CreateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: [CreateOrderDetailsDto],
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => CreateOrderDetailsDto)
  @ValidateNested({ each: true })
  cartItems: CartItemDto[];
}
