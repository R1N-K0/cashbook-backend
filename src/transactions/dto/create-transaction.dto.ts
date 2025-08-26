import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty({ message: 'category_idは必須です' })
  category_id: number

  @IsString({ message: 'データ形式が違います' })
  @IsDateString()
  @IsNotEmpty({ message: 'dateは必須です' })
  date: string

  @IsString()
  @IsNotEmpty({ message: 'descriptionは必須です' })
  @MaxLength(255)
  description: string

  @IsString()
  @IsOptional()
  memo?: string

  @IsNotEmpty({ message: 'amountは必須です' })
  @IsInt()
  amount: number
}
