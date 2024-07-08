import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: 'string', example: 'Quần áo' })
  keyword?: string;
}
