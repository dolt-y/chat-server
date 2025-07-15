import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '当前页' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ description: '每页条数' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;
}
