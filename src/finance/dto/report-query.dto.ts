import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class ReportQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsOptional()
  year?: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsOptional()
  month?: number
}
