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
  @IsNotEmpty({ message: 'カテゴリー名は必須です' })
  @MaxLength(255)
  name: string

  @IsEnum(CategoryType, { message: 'データ形式が違います' })
  type: CategoryType

  @IsString({ message: 'データ形式が違います' })
  @Validate(IsColorCode)
  color: string
}
