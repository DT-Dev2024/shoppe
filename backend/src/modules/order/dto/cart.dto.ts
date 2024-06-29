import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CreateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: [CartItemDto],
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => CartItemDto)
  @ValidateNested({ each: true })
  cartItems: CartItemDto[];
}
