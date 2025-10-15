import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import { CategoryResponseDto } from 'src/categories/dto/category-response.dto'

export function ApiCreateCategory() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiCreatedResponse({
      description: 'カテゴリーの作成に成功',
    }),
    ApiBadRequestResponse({ description: 'バリデーションエラー' }),
  )
}

export function ApiFindAllCategory() {
  return ApiResponse({
    description: 'カテゴリーの一覧に成功',
    status: 200,
    type: [CategoryResponseDto],
  })
}

export function ApiFindOneCategory() {
  return applyDecorators(
    ApiResponse({
      description: 'ID指定によってカテゴリーを取得',
      status: 200,
      type: CategoryResponseDto,
    }),
    ApiParam({
      description: 'カテゴリーID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiNotFoundResponse({ description: '存在しないIDを指定' }),
  )
}

export function ApiUpdateCategory() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      description: '更新するカテゴリーID',
      example: 2,
      name: 'id',
      type: Number,
    }),
    ApiOkResponse({
      description: 'カテゴリー更新成功',
      type: CategoryResponseDto,
    }),
    ApiNotFoundResponse({ description: '存在しないIDを指定' }),
  )
}

export function ApiRemoveCategory() {
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
