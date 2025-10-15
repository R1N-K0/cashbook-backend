import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator'
import { IsColorCode } from 'src/common/validators'
import { CategoryType } from 'src/entities/categories.entity'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'カテゴリー名のプロパティ',
    example: '食費',
  })
  @IsNotEmpty({ message: 'カテゴリー名は必須です' })
  @MaxLength(255)
  name: string

  @ApiProperty({
    description: '支出のタイプ',
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  @IsEnum(CategoryType, { message: 'データ形式が違います' })
  type: CategoryType

  @ApiProperty({
    description: 'カテゴリーのカラーコード',
    example: '#FFFFFF',
  })
  @IsString({ message: 'データ形式が違います' })
  @Validate(IsColorCode)
  color: string
}
