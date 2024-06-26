import { PartialType } from '@nestjs/mapped-types';
import { CreateUiDto } from './create-ui.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUiDto extends PartialType(CreateUiDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
