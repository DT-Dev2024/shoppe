import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailsDto } from './order-detail.dto';
import { CreateOrderDiscountDto } from './order-discount.dto';
import { Type } from 'class-transformer';

export enum OrderStatus {
  WAITING = 'WAITING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURN = 'RETURN',
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

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

  @ApiProperty({ type: [CreateOrderDetailsDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailsDto)
  orderDetails: CreateOrderDetailsDto[];

  @ApiProperty({
    type: CreateOrderDiscountDto,
  })
  orderDiscount: CreateOrderDiscountDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
