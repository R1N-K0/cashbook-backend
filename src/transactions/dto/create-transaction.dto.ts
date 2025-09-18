import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateTransactionDto {
  @ApiProperty({
    description: '取引に紐づけるカテゴリーのIDを表すプロパティ',
    example: 2,
  })
  @IsInt({ message: 'データ形式が違います' })
  @IsNotEmpty({ message: 'categoryIdは必須です' })
  categoryId: number

  @ApiProperty({
    description: '取引日を表すプロパティ(ISO 8601 形式)',
    example: '2025-08-28',
  })
  @IsString({ message: 'データ形式が違います' })
  @IsDateString()
  @IsNotEmpty({ message: 'dateは必須です' })
  date: string

  @ApiProperty({
    description: '取引の説明を表すプロパティ',
    example: '前期学費',
  })
  @IsString()
  @IsNotEmpty({ message: 'descriptionは必須です' })
  @MaxLength(255)
  description: string

  @ApiProperty({
    description: '取引内容についての補足',
    example: '学費の支払いのため',

    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  memo?: string

  @ApiProperty({
    description: '取引額を表すプロパティ',
    example: 12500000,
  })
  @IsNotEmpty({ message: 'amountは必須です' })
  @IsInt()
  amount: number

  @ApiProperty({
    description: '担当者IDを表すプロパティ',
    example: 1,
  })
  @IsNotEmpty({ message: 'createdUserIdは必須です' })
  @IsInt({ message: 'データ形式が違います' })
  createdUserId: number
}
