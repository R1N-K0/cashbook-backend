import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator'

export class CreateReceiptDto {
  @IsNotEmpty({ message: 'transactionIdは必要です' })
  @IsNumber()
  transactionId: number

  @IsString()
  @IsNotEmpty({ message: 's3Urlは必要です' })
  s3Url: string

  @IsString()
  @IsNotEmpty({ message: 'fileNameは必要です' })
  fileName: string

  @IsString()
  @IsNotEmpty({ message: 'mimeTypeは必要です' })
  @Matches(/^image\/(png|jpeg|jpg)$/, { message: 'データ形式が不正です' })
  mimeType: string
}
