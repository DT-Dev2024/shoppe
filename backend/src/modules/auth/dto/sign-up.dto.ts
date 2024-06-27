import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
