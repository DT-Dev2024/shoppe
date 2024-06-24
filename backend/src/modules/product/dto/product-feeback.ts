import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsNumber } from 'class-validator';

export class ProductFeedbackDTO {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  star: number;

  @IsInt()
  @ApiProperty()
  comment: number;

  @IsInt()
  @ApiProperty()
  sold: number;
}
