import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator'

export class CreateReceiptDto {
  @ApiProperty({
    description: 'レシート画像のURLを表すプロパティ',
    example: 'url',
  })
  @IsString()
  @IsNotEmpty({ message: 's3Urlは必要です' })
  s3Url: string

  @ApiProperty({
    description: '画像のファイル名を表すプロパティ',
    example: '取引画像1',
  })
  @IsString()
  @IsNotEmpty({ message: 'fileNameは必要です' })
  fileName: string

  @ApiProperty({
    description: '画像のmimeタイプを表すプロパティ',
    example: 'image/png',
  })
  @IsString()
  @IsNotEmpty({ message: 'mimeTypeは必要です' })
  @Matches(/^image\/(png|jpeg|jpg)$/, { message: 'データ形式が不正です' })
  mimeType: string

  @ApiProperty({ description: '紐づける取引IDを表すプロパティ', example: 2 })
  @IsNotEmpty({ message: 'transactionIdは必要です' })
  @IsNumber()
  transactionId: number
}
