import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { CreateOrderDetailsDto } from './order-detail.dto';
import { Type } from 'class-transformer';
import { PaymentMethod } from './payment-method';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ type: [CreateOrderDetailsDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailsDto)
  orderDetails: CreateOrderDetailsDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    default: PaymentMethod.MOMO,
    description:
      'Payment method is ' +
      PaymentMethod.MOMO +
      ' or ' +
      PaymentMethod.BANK +
      ' or ' +
      PaymentMethod.PAY_OFFLINE,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
