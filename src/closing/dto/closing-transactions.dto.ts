import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator'

export class ClosingTransactionsDto {
  @ApiProperty({ description: '締めの年度を表すプロパティ', example: 25 })
  @IsNotEmpty({ message: 'yearは必要です' })
  @IsInt()
  year: number

  @ApiProperty({
    description: '締めの月を表すプロパティ',
    example: 8,
  })
  @IsNotEmpty({ message: 'monthは必要です' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number
}
