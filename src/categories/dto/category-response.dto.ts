import { ApiProperty } from '@nestjs/swagger'

export class CategoryResponseDto {
  @ApiProperty({ description: 'カテゴリーID', example: 2 })
  id: number

  @ApiProperty({ description: 'カテゴリー名', example: '家賃' })
  name: string

  @ApiProperty({ description: 'カテゴリータイプ', example: 'expense' })
  type: string

  @ApiProperty({ description: 'カラーコード', example: '#FFFFFF' })
  color: string

  @ApiProperty({ description: '取引件数', example: 50 })
  count: number
}
