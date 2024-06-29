import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductFeedbackDTO } from './product-feeback';
import { ProductType } from './product-type';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsArray()
  detailImage: string[];

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false, description: 'Giảm giá theo %' })
  @IsNumber()
  sale_price: number;

  @ApiProperty({ required: false, type: () => ProductFeedbackDTO })
  @ValidateNested({ each: true })
  @Type(() => ProductFeedbackDTO)
  @IsOptional()
  feedback?: ProductFeedbackDTO;
}
