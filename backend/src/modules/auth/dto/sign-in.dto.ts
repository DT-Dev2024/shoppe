import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
