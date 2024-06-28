import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: CartItemDto,
  })
  @IsNotEmpty()
  cartItem: CartItemDto;
}
