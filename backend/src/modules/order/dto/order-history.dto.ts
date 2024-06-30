import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
export enum OrderStatus {
  WAITING = 'WAITING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURN = 'RETURN',
}
export class CreateOrderDetailsDto {
  @ApiProperty()
  @IsString()
  product: CreateProductDto;

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

  @ApiProperty()
  createAt: string;
  @ApiProperty()
  updateAt: string;
}
