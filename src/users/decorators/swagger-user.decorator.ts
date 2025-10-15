import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { UserResponse } from 'src/users/dto/user-response.dto'

export function ApiCreateUser() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiCreatedResponse({
      description: 'ユーザー作成に成功しました',
      type: UserResponse,
    }),
    ApiBadRequestResponse({ description: 'バリデーションエラー' }),
  )
}
