import { ApiProperty } from '@nestjs/swagger'

export class ReceiptResDto {
  @ApiProperty({ description: 'ファイル名', example: '取引画像1' })
  fileName: string

  @ApiProperty({ description: 'MIMEタイプ', example: 'image/png' })
  mimeType: string

  @ApiProperty({
    description: 'S3に保存されているファイルのURL',
    example: 'url',
  })
  s3Url: string
}
