import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger'
import { ReceiptResDto } from 'src/receipts/dto/receipt-response.dto'

export function ApiCreateReceipt() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiCreatedResponse({
      description: 'レシート画像の登録に成功',
      type: ReceiptResDto,
    }),
    ApiBadRequestResponse({ description: 'バリデーションエラー' }),
  )
}

export function ApiRemoveReceipt() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiParam({
      description: '削除するカテゴリーID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiNoContentResponse({ description: 'カテゴリー削除成功' }),
    ApiNotFoundResponse({ description: '存在しないIDを指定' }),
  )
}
