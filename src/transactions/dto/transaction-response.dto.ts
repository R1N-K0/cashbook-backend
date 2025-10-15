import { ApiProperty } from '@nestjs/swagger'

class UserRes {
  @ApiProperty({ description: 'ユーザーID', example: '1' })
  id: string

  @ApiProperty({ description: 'ユーザー名', example: 'User' })
  name: string
}

class CategoryRes {
  @ApiProperty({ description: 'カテゴリーID', example: '2' })
  id: string

  @ApiProperty({ description: 'カテゴリー名', example: '旅行費' })
  name: string

  @ApiProperty({ description: 'カテゴリー種別', example: 'expense' })
  type: string

  @ApiProperty({ description: 'カテゴリーカラーコード', example: '#FFFFFF' })
  color: string
}

class ReceiptRes {
  @ApiProperty({
    description: 'S3に保存されているファイルのURL',
    example: 'url',
  })
  s3Url: string

  @ApiProperty({ description: 'ファイル名', example: 'ファイル名' })
  fileName: string

  @ApiProperty({ description: 'MIMEタイプ', example: 'image/png' })
  mimeType: string
}

export class TransactionResponseDto {
  @ApiProperty({ description: '取引ID', example: '2' })
  id: string

  @ApiProperty({ description: '担当ユーザー', example: 'test' })
  createdUser: string

  @ApiProperty({ description: '取引日付 (YYYY-MM-DD)', example: '2025-08-26' })
  date: string

  @ApiProperty({ description: '取引の説明', example: '衣服購入のため' })
  description: string

  @ApiProperty({
    description: 'カテゴリー情報',
    nullable: true,
    type: CategoryRes,
  })
  category: CategoryRes

  @ApiProperty({
    description: 'メモ',
    example: '大学前期の学費支払い',
    nullable: true,
  })
  memo: string | null

  @ApiProperty({ description: '金額', example: 3000 })
  amount: number

  @ApiProperty({ description: '編集可能かどうか', example: false })
  editable: boolean
}

export class TransactionDetailDto extends TransactionResponseDto {
  @ApiProperty({
    description: 'レシート情報の配列',
    nullable: true,
    type: [ReceiptRes],
  })
  receipts: ReceiptRes[] | null

  @ApiProperty({ description: '更新ユーザー', example: 'test' })
  updatedUser: string

  @ApiProperty({
    description: '作成日時 (ISO 8601形式)',
    example: '2025-08-26T09:01:01.937Z',
  })
  created_at: string

  @ApiProperty({
    description: '更新日時 (ISO 8601形式)',
    example: '2025-08-27T06:39:22.317Z',
  })
  updated_at: string
}

export class TransactionUpdateDto extends TransactionResponseDto {
  @ApiProperty({ description: '更新ユーザー', example: 'test' })
  updatedUser: string

  @ApiProperty({
    description: '作成日時 (ISO 8601形式)',
    example: '2025-08-26T09:01:01.937Z',
  })
  created_at: string

  @ApiProperty({
    description: '更新日時 (ISO 8601形式)',
    example: '2025-08-27T06:39:22.317Z',
  })
  updated_at: string
}
