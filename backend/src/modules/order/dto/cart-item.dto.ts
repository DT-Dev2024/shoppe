import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from './order-detail.dto';

export class CartItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  buy_count: number;

  @ApiProperty({
    default: OrderStatus.WAITING,
    description:
      'Order status is ' +
      OrderStatus.WAITING +
      ' or ' +
      OrderStatus.DELIVERING +
      ' or ' +
      OrderStatus.DELIVERED +
      ' or ' +
      OrderStatus.CANCELED +
      ' or ' +
      OrderStatus.RETURN,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price_before_discount: number;
}
