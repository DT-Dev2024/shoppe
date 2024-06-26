import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUi } from '../types/update-ui.type';
export class UpdateKeywordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: UpdateUi;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
