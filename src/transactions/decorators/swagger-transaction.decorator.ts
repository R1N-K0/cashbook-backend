import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import {
  TransactionDetailDto,
  TransactionResponseDto,
  TransactionUpdateDto,
} from 'src/transactions/dto/transaction-response.dto'

export function ApiCreateTransaction() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'トランザクションが作成できました',
    }),
    ApiBadRequestResponse({ description: 'バリデーションエラー' }),
  )
}

export function ApiFindAllTransaction() {
  return applyDecorators(
    ApiResponse({
      description: '取引の一覧取得に成功',
      status: 200,
      type: [TransactionResponseDto],
    }),
  )
}

export function ApiFindOneTransaction() {
  return applyDecorators(
    ApiResponse({
      description: '取引の取得に成功',
      status: 200,
      type: TransactionDetailDto,
    }),
    ApiParam({
      description: 'カテゴリーID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiNotFoundResponse({
      description: '存在しないIDを指定',
    }),
  )
}

export function ApiUpdateTransaction() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      description: '更新する取引ID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiOkResponse({
      description: '取引情報の更新成功',
      type: TransactionUpdateDto,
    }),
    ApiForbiddenResponse({ description: '編集不可データ' }),
    ApiNotFoundResponse({ description: '存在しないIDを指定' }),
  )
}

export function ApiRemoveTransaction() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiParam({
      description: '削除するカテゴリーID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiNoContentResponse({ description: '取引情報の削除成功' }),
    ApiNotFoundResponse({ description: '存在しないIDを指定' }),
    ApiForbiddenResponse({ description: '削除不可データ' }),
  )
}
