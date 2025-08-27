import { IsInt, IsNotEmpty, Max, Min } from 'class-validator'

export class ClosingTransactionsDto {
  @IsNotEmpty({ message: 'monthは必要です' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number

  @IsNotEmpty({ message: 'yearは必要です' })
  @IsInt()
  year: number
}
