import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  MOMO: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  BANK: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  PAY_OFFLINE: string;

  @ApiProperty({
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
